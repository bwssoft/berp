import { IProfile } from "@/app/lib/@backend/domain";
import { ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Button, Toggle } from "../../../component";
import { ActiveProfileDialog, useActiveProfileDialog } from "../../../dialog";

export const ProfileAction = (props: { profile: IProfile }) => {
  const { profile } = props;
  const dialog = useActiveProfileDialog();

  return (
    <td className="flex gap-2 items-center">
      <Button
        title="Histórico"
        onClick={() => alert("Modal com histórico de alterações nesse perfil")}
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <ClockIcon className="size-5" />
      </Button>
      <Button
        title="Usuários"
        onClick={() => alert("Modal com os usuários desse perfil")}
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <UsersIcon className="size-5" />
      </Button>
      <button onClick={() => dialog.handleOpen(profile.id, !profile.active)}>
        <Toggle
          value={profile.active}
          disabled={true}
          title={(value) => (value ? "Inativar" : "Ativar")}
          className="pointer-events-none"
        />
      </button>

      <ActiveProfileDialog
        open={dialog.open}
        setOpen={dialog.setOpen}
        confirm={dialog.confirm}
        isLoading={dialog.isLoading}
        willActivate={dialog.activate}
      />
    </td>
  );
};
