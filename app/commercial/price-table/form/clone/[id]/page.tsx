"use client";

import { UpsertPriceTableForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/create/price-table.upsert.form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/backend/action/auth/restrict.action";
import { useRouter } from "next/navigation";

export default function ClonePriceTablePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [canCreate, setCanCreate] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const hasCreatePermission = await restrictFeatureByProfile(
          "commercial:price-table:create"
        );
        setCanCreate(hasCreatePermission);

        if (!hasCreatePermission) {
          // Redirecionar para página principal se não tem permissão
          router.push("/commercial/price-table");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        router.push("/commercial/price-table");
      }
    };

    checkPermissions();
  }, [router]);

  // Aguardar verificação de permissões
  if (canCreate === null) {
    return (
      <div className="bg-white pt-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não tem permissão, não renderizar o formulário (já redirecionou)
  if (!canCreate) {
    return null;
  }

  return (
    <div className="bg-white pt-8">
      <UpsertPriceTableForm
        priceTableId={id}
        editMode={false}
        cloneMode={true}
      />
    </div>
  );
}
