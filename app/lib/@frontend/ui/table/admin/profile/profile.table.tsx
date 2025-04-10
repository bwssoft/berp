"use client";

import { IProfile } from "@/app/lib/@backend/domain";
import { columns } from "./profile.columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { ActiveProfileDialog, useActiveProfileDialog } from "../../../dialog";
import {
  UserLinkedProfileModal,
  useUserLinkedProfileModal,
} from "../../../modal";
import {
  AuditProfileModal,
  useAuditProfileModal,
} from "../../../modal/admin/profile/audit-profile";

interface Props {
  data: IProfile[];
}
export function ProfileTable(props: Props) {
  const { data } = props;
  const activeDialog = useActiveProfileDialog();
  const userModal = useUserLinkedProfileModal();
  const audtiModal = useAuditProfileModal();

  return (
    <>
      <DataTable
        columns={columns({
          openActiveDialog: activeDialog.handleOpen,
          openUserModal: userModal.handleProfileSelection,
          openAuditModal: audtiModal.handleProfileSelection,
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

      <AuditProfileModal
        audits={audtiModal.auditData}
        closeModal={audtiModal.closeModal}
        open={audtiModal.open}
        profile={audtiModal.profile}
      />
    </>
  );
}
