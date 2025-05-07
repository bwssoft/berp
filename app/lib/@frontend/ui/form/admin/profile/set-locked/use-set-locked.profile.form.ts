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
  const { control, profile } = props;

  const handleLocked = useCallback(
    async (arg: boolean) => {
      if (!profile) return;

      const parts = control.code.split(":");
      const moduleCodes = parts.map((_, i) => parts.slice(0, i + 1).join(":"));

      if (arg) {
        // no caso de add, mantemos sua lógica original
        await setLockedControl({
          id: profile.id,
          locked_control_code: [control.code, ...moduleCodes],
          operation: "add",
          control_name: control.name,
        });
      } else {
        // === remoção dinâmica ===
        const codesToRemove = new Set<string>([control.code]);

        // percorre de baixo pra cima
        for (let i = parts.length - 1; i >= 0; i--) {
          const prefix = parts.slice(0, i + 1).join(":");

          // filtra irmãos EXCLUINDO tudo que já está marcado para remoção
          const siblings = profile.locked_control_code.filter(
            (c) => c.startsWith(prefix + ":") && !codesToRemove.has(c)
          );

          if (siblings.length === 0) {
            codesToRemove.add(prefix);
            // continua subindo para ver se remove também níveis acima
          } else {
            break; // ainda há irmãos “vivos” → pare de subir
          }
        }

        await setLockedControl({
          id: profile.id,
          locked_control_code: Array.from(codesToRemove),
          operation: "remove",
          control_name: control.name,
        });
      }

      toast({
        variant: "success",
        title: "Sucesso",
        description: `Acesso '${control.name}' ${
          arg ? "adicionado" : "removido"
        } do perfil '${profile.name}'`,
      });
    },
    [control, profile]
  );

  return { handleLocked };
}
