"use client";

import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { IUser } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { columns } from "./user.columns";
import {
    AuditUserModal,
    useAuditUserModal,
} from "@/app/lib/@frontend/ui/modal";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { useAuth } from "@/app/lib/@frontend/context";

const PAGE_SIZE = 10;

interface Props {
    data: PaginationResult<IUser>;
    currentPage?: number;
}

export function UserTable({ data, currentPage = 1 }: Props) {
    const { docs, pages = 1, total = 0, limit = PAGE_SIZE } = data;
    const { handleParamsChange } = useHandleParamsChange();
    const handlePageChange = (page: number) => handleParamsChange({ page });

    const modal = useAuditUserModal();

    const { restrictFeatureByProfile } = useAuth();

    return (
        <>
            <div className="w-full">
                <DataTable
                    columns={columns({
                        openAuditModal: modal.handleUserSelection,
                        restrictFeatureByProfile,
                    })}
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
                currentPage={modal.page}
                auditData={modal.auditData ?? { docs: [] }}
                closeModal={modal.closeModal}
                open={modal.open}
                user={modal.user}
                handlePageChange={modal.handlePageChange}
            />
        </>
    );
}
