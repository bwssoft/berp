import { setLockedControl } from "@/app/lib/@backend/action";
import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { useCallback } from "react";

interface Props {
  control: IControl;
  totalControlsOnModule: number;
  profile: IProfile | null;
}

export function useSetLockedProfileForm(props: Props) {
  const { control, profile, totalControlsOnModule } = props;

  const handleLocked = useCallback(
    async (arg: boolean) => {
      if (!profile) return;

      const parts = control.code.split(":");
      // ["engineer", "engineer:product", "engineer:product:create"]
      const moduleCodes = parts.map((_, i) => parts.slice(0, i + 1).join(":"));

      // Para remoção, vamos descobrir quais prefixes realmente devem "destravar"
      const unlockPrefixes: string[] = [];

      if (!arg) {
        // percorre de baixo pra cima (do controle até a raiz)
        for (let i = parts.length - 1; i >= 0; i--) {
          const prefix = parts.slice(0, i + 1).join(":");
          // procura **outros** códigos bloqueados que partilham esse prefixo
          const siblings = profile.locked_control_code.filter(
            (c) => c.startsWith(prefix + ":") && c !== control.code
          );
          // se não existir nenhum irmão restante, podemos destravar este nível
          if (siblings.length === 0) {
            unlockPrefixes.push(prefix);
          } else {
            // encontrou irmãos bloqueados → parar de subir na hierarquia
            break;
          }
        }
      }

      // para adição, a lógica continua a mesma de antes
      const lockedCodes = [control.code];
      if (arg) {
        // se não havia NADA do módulo raiz bloqueado, bloqueia toda a cadeia
        lockedCodes.push(...moduleCodes);
      }

      // se for remoção, adiciona apenas os prefixes válidos
      if (!arg) {
        lockedCodes.push(...unlockPrefixes);
      }

      await setLockedControl({
        id: profile.id,
        locked_control_code: lockedCodes,
        operation: arg ? "add" : "remove",
        control_name: control.name,
      });

      toast({
        variant: "success",
        title: "Sucesso",
        description: `Acesso '${control.name}' ${arg ? "adicionado" : "removido"} do perfil '${profile.name}'`,
      });
    },
    [control, profile]
  );

  return { handleLocked };
}
