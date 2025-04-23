"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./user.columns";
import {
  AuditUserModal,
  useAuditUserModal,
} from "@/app/lib/@frontend/ui/modal";
import { PaginationTailwind } from "../../../component/pagination";
import { useUsers } from "./use.users";

const PAGE_SIZE = 10;

export function UserTable() {
  /* -------- leitura do search param -------- */
  const searchParams = useSearchParams();
  const pageParam   = searchParams.get("page");
  const page        = pageParam ? Math.max(1, Number(pageParam)) : 1;

  /* -------- dados -------- */
  const { data, isLoading } = useUsers(page, PAGE_SIZE);
  const { docs = [], total = 0, pages = 1 } = data ?? {};

  /* -------- modal -------- */
  const modal  = useAuditUserModal();

  /* -------- troca de página na URL -------- */
  const router = useRouter();
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`?${params.toString()}`, { scroll: false });
    // scroll: false evita pular para o topo
  };

  if (isLoading || !data) return <p>Carregando…</p>;

  return (
    <>
     <div className="mt-4">
      <DataTable
        columns={columns({ openAuditModal: modal.handleUserSelection })}
        data={docs}
        mobileDisplayValue={(u) => u.name}
        mobileKeyExtractor={(u) => u._id.toString()}
      />

     
        <PaginationTailwind
          currentPage={page}
          totalPages={pages}
          totalItems={total}
          limit={PAGE_SIZE}
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
