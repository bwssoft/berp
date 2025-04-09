"use client";

import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { useSetLockedProfileForm } from "./use-set-locked.profile.form";
import { Button, Toggle } from "../../../../component";
import {
  ClockIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ProfileLinkedControlModal } from "../../../../modal";
import { useState } from "react";

interface Props {
  control: IControl;
  profile: IProfile | null;
  totalControlsOnModule: number;
}

export function SetLockedProfileForm(props: Props) {
  const { control, profile } = props;
  const { handleLocked } = useSetLockedProfileForm(props);
  const [openControlCode, setOpenControlCode ] = useState(false)

  return (
    <form className="flex justify-between w-full items-center">
      <p className="flex gap-2">
        {control.name}
        <span>
          <InformationCircleIcon
            className="size-5"
            title={control.description}
          />
        </span>
      </p>
      <div className="flex gap-2 items-center">
        <Button
          type="button"
          title="Histórico"
          onClick={(e) => {
            e.preventDefault();
            alert(
              "Modal com histórico de alterações de qualquer perfil que recebeu ou foi removido esse control"
            );
          }}
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ClockIcon className="size-5" />
        </Button>
        <Button
          type="button"
          title="Perfis"
          onClick={(e) => {
            e.preventDefault();
            setOpenControlCode(prev => !prev)
          }}
          className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <IdentificationIcon className="size-5" />
        </Button>
        {profile ? (
          <Toggle
            value={!profile.locked_control_code.includes(control.code)}
            onChange={handleLocked}
            title={(value) => (value ? "Remover acesso" : "Conceder acesso")}
          />
        ) : (
          <></>
        )}
      </div>
      <ProfileLinkedControlModal 
        onClose={() => {setOpenControlCode(prev => !prev)}} 
        open={openControlCode} 
        codeControl={control.code}
      />
    </form>
  );
}
