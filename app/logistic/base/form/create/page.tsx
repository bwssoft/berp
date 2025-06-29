import { findManyEnterprise } from "@/app/lib/@backend/action/business/enterprise.action";
import { BackButton } from "@/app/lib/@frontend/ui/component";
import { CreateOneBaseForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  const { docs: enterprises } = await findManyEnterprise({ filter: {} });
  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Criar Nova Base
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para criar uma nova base.
              </p>
            </div>
          </div>
        </div>
        <CreateOneBaseForm enterprises={enterprises} />
      </div>
    </div>
  );
}
