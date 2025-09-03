"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { CreatePriceTableForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/create/price-table.create.form";
import Link from "next/link";

export default function CreatePriceTablePage() {
  return (
    <div className="space-y-4">
      {/* Header with title and buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tabela de Preços
        </h1>
        <div className="flex gap-2">
          <Link href="/commercial/price-table">
            <Button variant="outline">Voltar</Button>
          </Link>
          <Button>Salvar</Button>
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white">
        <CreatePriceTableForm />
      </div>
    </div>
  );
}
