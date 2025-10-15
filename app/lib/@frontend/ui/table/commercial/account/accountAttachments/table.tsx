"use client";

import {IAccountAttachment} from "@/backend/domain/commercial/entity/account-attachment.definition";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { createColumns } from "./columns";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import { Pagination } from "../../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

interface Props {
  data: PaginationResult<IAccountAttachment>;
  onDelete?: (id: string) => Promise<void>;
  hasPermission?: boolean
  currentPage?: number;
}

export function AccountAttachmentsTable(props: Props) {
    const { data, onDelete, hasPermission, currentPage = 1 } = props;

    const { docs, pages = 1, total = 0, limit = 10 } = data;
    const { handleParamsChange } = useHandleParamsChange();

    const tableColumns = createColumns(onDelete, hasPermission);

    return (
      <div>
        <DataTable
          columns={tableColumns}
          data={docs}
          mobileDisplayValue={(data) => data.name}
          mobileKeyExtractor={(data) => data.createdAt.toString()}
          className="w-full mt-10"
        />

        <Pagination
            currentPage={currentPage}
            totalPages={pages}
            totalItems={total}
            limit={limit}
            onPageChange={(page) => handleParamsChange({ page })}
        />
      </div>
    );
}

