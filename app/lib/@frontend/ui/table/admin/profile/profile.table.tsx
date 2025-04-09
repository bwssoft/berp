"use client";

import { IProfile } from "@/app/lib/@backend/domain";
import { columns } from "./profile.columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { ActiveProfileDialog, useActiveProfileDialog } from "../../../dialog";
import { useUserLinkedProfileModal } from "../../../modal/admin/profile/user-linked/use-user-linked.profile.modal";
import { UserLinkedProfileModal } from "../../../modal";

interface Props {
  data: IProfile[];
}
export function ProfileTable(props: Props) {
  const { data } = props;
  const activeDialog = useActiveProfileDialog();
  const userModal = useUserLinkedProfileModal();

  return (
    <>
      <DataTable
        columns={columns({
          openActiveDialog: activeDialog.handleOpen,
          openUserModal: userModal.handleProfileSelection,
        })}
        data={data}
        mobileDisplayValue={(data) => data.name}
        mobileKeyExtractor={(data) => data.created_at?.toISOString()}
        className="w-full"
      />

      <ActiveProfileDialog
        open={activeDialog.open}
        setOpen={activeDialog.setOpen}
        confirm={activeDialog.confirm}
        isLoading={activeDialog.isLoading}
        willActivate={activeDialog.activate}
      />

      <UserLinkedProfileModal
        users={userModal.users}
        closeModal={userModal.closeModal}
        open={userModal.open}
        profile={userModal.profile}
      />
    </>
  );
}
