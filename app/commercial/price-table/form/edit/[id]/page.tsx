"use client";

import { UpsertPriceTableForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/create/price-table.upsert.form";
import { useParams } from "next/navigation";

export default function EditPriceTablePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="bg-white pt-8">
      <UpsertPriceTableForm priceTableId={id} editMode={true} />
    </div>
  );
}
