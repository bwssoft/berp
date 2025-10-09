"use client";

import {IControl} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import {IProfile} from "@/app/lib/@backend/domain/admin/entity/profile.definition";
import { useSetLockedProfileForm } from "./use-set-locked.profile.form";
import { Toggle } from '@/frontend/ui/component/toggle';


interface Props {
  control: IControl;
  profile: IProfile | null;
  totalControlsOnModule: number;
}

export function SetLockedProfileForm(props: Props) {
  const { control, profile } = props;
  const { handleLocked, isUpdating } = useSetLockedProfileForm(props);

  return (
    <form>
      {profile ? (
        <Toggle
          value={profile.locked_control_code.includes(control.code)}
          onChange={handleLocked}
          disabled={isUpdating}
          title={(value) =>
            isUpdating
              ? "Atualizando..."
              : value
                ? "Remover acesso"
                : "Conceder acesso"
          }
        />
      ) : (
        <></>
      )}
    </form>
  );
}
