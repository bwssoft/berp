import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { useAuth } from "@/app/lib/@frontend/context";
import { toast } from "@/app/lib/@frontend/hook";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { setLockedControl } from "@/app/lib/@backend/action/admin/profile.action";

interface Props {
  control: IControl;
  totalControlsOnModule: number;
  profile: IProfile | null;
}

export function useSetLockedProfileForm(props: Props) {
  const { control, profile } = props;
  const { data } = useSession();
  const { refreshCurrentProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLocked = useCallback(
    async (arg: boolean) => {
      if (!profile) return;

      try {
        setIsUpdating(true);

        const parts = control.code.split(":");
        const moduleCodes = parts.map((_, i) =>
          parts.slice(0, i + 1).join(":")
        );

        if (arg) {
          // no caso de add, mantemos sua lógica original
          try {
            const result = await setLockedControl({
              id: profile.id,
              locked_control_code: [control.code, ...moduleCodes],
              operation: "add",
              control_name: control.name,
            });

            if (!result?.success) {
              throw new Error(result?.error || "Failed to add permission");
            }
          } catch (error) {
            console.error("Error adding permissions:", error);
            throw new Error(
              error instanceof Error
                ? error.message
                : "Failed to add permission"
            );
          }
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
              break; // ainda há irmãos "vivos" → pare de subir
            }
          }

          console.log("Removing permissions:", Array.from(codesToRemove));
          try {
            const result = await setLockedControl({
              id: profile.id,
              locked_control_code: Array.from(codesToRemove),
              operation: "remove",
              control_name: control.name,
            });

            if (!result?.success) {
              throw new Error(result?.error || "Failed to remove permission");
            }
          } catch (error) {
            console.error("Error removing permissions:", error);
            throw new Error(
              error instanceof Error
                ? error.message
                : "Failed to remove permission"
            );
          }
        }

        toast({
          variant: "success",
          title: "Sucesso",
          description: `Acesso '${control.name}' ${
            arg ? "adicionado" : "removido"
          } do perfil '${profile.name}'`,
        });

        console.log(
          `Permission toggle success: ${control.name} ${arg ? "added to" : "removed from"} ${profile.name}`
        );

        // Refresh the session if the current user's profile was updated
        if (data?.user?.current_profile?.id === profile.id) {
          // Use the auth context to refresh the current profile without reloading the page
          const success = await refreshCurrentProfile();
          if (!success) {
            console.warn("Profile refresh may not have updated all components");
          }
        }
      } catch (error) {
        console.error("Error updating permissions:", error);
        toast({
          variant: "error",
          title: "Erro",
          description:
            error instanceof Error
              ? `Falha: ${error.message}`
              : "Falha ao atualizar permissões. Tente novamente.",
        });

        // Try to refresh the profile anyway in case the operation partially succeeded
        if (data?.user?.current_profile?.id === profile.id) {
          try {
            await refreshCurrentProfile();
          } catch (refreshError) {
            console.error("Failed to refresh after error:", refreshError);
          }
        }
      } finally {
        setIsUpdating(false);
      }
    },
    [control, profile, data, refreshCurrentProfile]
  );

  return { handleLocked, isUpdating };
}
