"use client";

import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { DataTable } from "@/app/lib/@frontend/ui/component/data-table";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";

interface Props {
  data: IAccountAttachment[];
  onDelete?: (id: string) => Promise<void>;
}

export function AccountAttachmentsTable(props: Props) {
  const { data, onDelete } = props;
  const [canDeleteAttachments, setCanDeleteAttachments] = useState(false);

  useEffect(() => {
      (async () => {
        try {
          const hasPermission = await restrictFeatureByProfile(
            "commercial:accounts:access:tab:attachments:delete"
          );
          setCanDeleteAttachments(hasPermission);
        } catch (error) {
          console.error("Error checking delete permission:", error);
        }
      })();
    }, []);

    const tableColumns = createColumns(onDelete, canDeleteAttachments);

    return (
      <DataTable
        columns={tableColumns}
        data={data}
        mobileDisplayValue={(data) => data.name}
        mobileKeyExtractor={(data) => data.createdAt.toString()}
        className="w-full mt-10"
      />
    );
}
