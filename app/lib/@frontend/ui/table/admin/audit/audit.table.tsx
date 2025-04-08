"use client";

import { IAudit } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./audit.columns";

interface AuditTableProps {
  data: IAudit[];
}

export function AuditTable({ data }: AuditTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(audit) => `${audit.action} - ${audit.user.name}`}
      mobileKeyExtractor={(audit) => audit.created_at?.toISOString()}
      className="w-full"
    />
  );
}
