import { findManyBase, findManyItem } from "@/app/lib/@backend/action";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import { CreateMovementForm } from "@/app/lib/@frontend/ui/form/logistic/movement";
import { Zap } from "lucide-react";

export default async function Page() {
  const [{ docs: items }, { docs: bases }] = await Promise.all([
    findManyItem({ filter: {} }),
    findManyBase({ filter: {} }),
  ]);
  return (
    <div>
      <div className="w-4/6">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  Registro de movimentações
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Compacto
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Registre múltiplas movimentações de forma rápida e eficiente
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <CreateMovementForm items={items} bases={bases} />
        </div>
      </div>
    </div>
  );
}
