"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { IUser } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./user.columns";
import { AuditUserModal, useAuditUserModal } from "@/app/lib/@frontend/ui/modal";
import { Pagination} from "../../../component/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";

const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IUser>;
}

export function UserTable({ data }: Props) {
  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Math.max(1, Number(pageParam)) : 1;
  
  const { handleParamsChange } = useHandleParamsChange();
  const handlePageChange = (page: number) => handleParamsChange({ page })
  const modal = useAuditUserModal();
  return (
    <>
      <div className="w-full">
        <DataTable
          columns={columns({ openAuditModal: modal.handleUserSelection })}
          data={docs}
          mobileDisplayValue={(u) => u.name}
          mobileKeyExtractor={(u) => u.id.toString()}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          totalItems={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      <AuditUserModal
        auditData={modal.auditData}
        closeModal={modal.closeModal}
        open={modal.open}
        user={modal.user}
      />
    </>
  );
}
