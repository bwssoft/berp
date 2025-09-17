"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { IPriceTable } from "@/app/lib/@backend/domain/commercial/entity/price-table.definition";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { createPriceTableColumns } from "./price-table.columns";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../component/table";
import { useRouter } from "next/navigation";

interface Props {
  data: PaginationResult<IPriceTable>;
  currentPage?: number;
  restrictEdit: boolean;
  restrictClone: boolean;
}

export function PriceTableTable({
  data,
  currentPage = 1,
  restrictEdit,
  restrictClone,
}: Props) {
  const { docs, pages = 1, total = 0, limit = 10 } = data;
  const router = useRouter();

  const handleEditPriceTable = (priceTable: IPriceTable) => {
    // Navigate directly with just the ID
    router.push(`/commercial/price-table/form/edit/${priceTable.id}`);
  };

  const handleClonePriceTable = (priceTable: IPriceTable) => {
    router.push(`/commercial/price-table/form/clone/${priceTable.id}`);
  };

  const columns = createPriceTableColumns({
    onEditPriceTable: handleEditPriceTable,
    onClonePriceTable: handleClonePriceTable,
  });

  const table = useReactTable({
    data: docs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { restrictEdit, restrictClone },
  });
  const { handleParamsChange } = useHandleParamsChange();

  return (
    <div className="w-full">
      <div className="border rounded-md overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-48 text-center p-8"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p className="text-sm">Nenhum dado encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
