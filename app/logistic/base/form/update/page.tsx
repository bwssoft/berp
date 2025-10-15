import { findManyEnterprise } from "@/backend/action/business/enterprise.action";
import { findOneBase } from "@/backend/action/logistic/base.action";
import { BackButton } from '@/frontend/ui/component/back-button';
import { UpdateOneBaseForm } from '@/frontend/ui/form/logistic/base/update/update.base.form';


interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const [base, { docs: enterprises }] = await Promise.all([
    findOneBase({ filter: { id } }),
    findManyEnterprise({ filter: {} }),
  ]);

  if (!base)
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Ops.
            </h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Base não existente.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="w-4/6 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
        <div className="flex items-end gap-4">
          <BackButton />
          <div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Atualizar Base
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para atualizar a base.
              </p>
            </div>
          </div>
        </div>
        <UpdateOneBaseForm enterprises={enterprises} base={base} />
      </div>
    </div>
  );
}

