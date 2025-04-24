"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/IPagination.interface";
import { IUser } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./user.columns";
import { AuditUserModal, useAuditUserModal } from "@/app/lib/@frontend/ui/modal";
import { PaginationTailwind } from "../../../component/pagination";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;

interface Props {
  data: PaginationResult<IUser>;
}

export function UserTable({ data }: Props) {
  const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;

  const searchParams = useSearchParams();
  const router       = useRouter();
  const pageParam    = searchParams.get("page");
  const currentPage  = pageParam ? Math.max(1, Number(pageParam)) : 1;

  const modal = useAuditUserModal();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className="w-full">
        <DataTable
          columns={columns({ openAuditModal: modal.handleUserSelection })}
          data={docs}
          mobileDisplayValue={(u) => u.name}
          mobileKeyExtractor={(u) => u.id.toString()}
        />

        <PaginationTailwind
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
