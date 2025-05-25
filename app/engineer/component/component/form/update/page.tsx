import {
  findManyComponentCategory,
  findOneComponent,
} from "@/app/lib/@backend/action";
import {
  BackButton,
  UpdateOneComponentForm,
} from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;

  const [{ docs: categories }, component] = await Promise.all([
    findManyComponentCategory({ filter: {} }),
    findOneComponent({ id }),
  ]);

  if (!component)
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Ops.
            </h1>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Componente não encontrado.
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
                Atualizar Componente
              </h1>
              <p className="text-sm text-gray-600">
                Preencha os dados para atualizar o componente.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <UpdateOneComponentForm
            categories={categories}
            component={component}
          />
        </div>
      </div>
    </div>
  );
}
