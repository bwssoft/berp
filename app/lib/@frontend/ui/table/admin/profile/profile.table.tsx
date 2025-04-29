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
import { useSearchParams } from "next/navigation";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { Pagination } from "../../../component/pagination";


const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IProfile>;
}

export function ProfileTable(props: Props) {
  const { data } = props;
  const activeDialog = useActiveProfileDialog();
  const userModal = useUserLinkedProfileModal();
  const audtiModal = useAuditProfileModal();

  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;
  
  const { handleParamsChange } = useHandleParamsChange();
  const handlePageChange = (page: number) => handleParamsChange({ page })
  
  return (
    <>
    <div className="w-full">
      <DataTable
        columns={columns({
          openActiveDialog: activeDialog.handleOpen,
          openUserModal: userModal.handleProfileSelection,
          openAuditModal: audtiModal.handleProfileSelection,
        })}
        data={docs}
        mobileDisplayValue={(data) => data.name}
        mobileKeyExtractor={(data) => data.created_at?.toISOString()}
        className="w-full"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        totalItems={total}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>

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
        isLoading={userModal.isLoading}
      />

      <AuditProfileModal
        audits={{ docs: audtiModal.auditData }}
        closeModal={audtiModal.closeModal}
        open={audtiModal.open}
        profile={audtiModal.profile}
      />
    </>
  );
}
