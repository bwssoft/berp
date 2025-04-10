"use client";

import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { useSetLockedProfileForm } from "./use-set-locked.profile.form";
import { Toggle } from "../../../../component";

interface Props {
  control: IControl;
  profile: IProfile | null;
  totalControlsOnModule: number;
}

export function SetLockedProfileForm(props: Props) {
  const { control, profile } = props;
  const { handleLocked } = useSetLockedProfileForm(props);

  return (
    <form>
      {profile ? (
        <Toggle
          value={!profile.locked_control_code.includes(control.code)}
          onChange={handleLocked}
          title={(value) => (value ? "Remover acesso" : "Conceder acesso")}
        />
      ) : (
        <></>
      )}
    </form>
  );
}
