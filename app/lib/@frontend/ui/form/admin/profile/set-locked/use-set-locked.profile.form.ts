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
      try {
        const moduleCode = control.code.split(":")[0];
        const moduleItemsInProfile = profile.locked_control_code.filter((el) =>
          el.startsWith(`${moduleCode}:`)
        );

        let lockedCodes: string[] = [control.code];

        if (!arg && moduleItemsInProfile.length + 1 === totalControlsOnModule) {
          lockedCodes.push(moduleCode);
        } else if (
          arg &&
          moduleItemsInProfile.length === totalControlsOnModule
        ) {
          lockedCodes.push(moduleCode);
        }

        await setLockedControl({
          id: profile.id,
          locked_control_code: lockedCodes,
          operation: !arg ? "add" : "remove",
          control_name: control.name,
        });

        toast({
          variant: "success",
          description: `Acesso '${control.name}' ${arg ? "adicionado" : "removido"} do perfil '${profile.name}'`,
          title: "Sucesso",
        });
      } catch (error) {
        toast({
          variant: "error",
          description: `${error instanceof Error ? error.message : JSON.stringify(error)}`,
          title: "Sucesso",
        });
      }
    },
    [control, profile]
  );

  return {
    handleLocked,
  };
}
