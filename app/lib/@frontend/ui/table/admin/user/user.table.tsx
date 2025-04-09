"use client";

import { IUser } from "@/app/lib/@backend/domain";
import { columns } from "./user.columns";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import {
  AuditUserModal,
  useAuditUserModal,
} from "@/app/lib/@frontend/ui/modal";

interface Props {
  data: IUser[];
}
export function UserTable(props: Props) {
  const { data } = props;
  const modal = useAuditUserModal();

  return (
    <>
      <DataTable
        columns={columns({openAuditModal: modal.handleUserSelection})}
        data={data}
        mobileDisplayValue={(data) => data.name}
        mobileKeyExtractor={(data) => data.created_at?.toISOString()}
        className="w-full"
      />

      <AuditUserModal
        auditData={modal.auditData}
        closeModal={modal.closeModal}
        open={modal.open}
        user={modal.user}
      />
    </>
  );
}
