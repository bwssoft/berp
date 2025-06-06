import {
  findManyInput,
  findManyProductCategory,
  findManyTechnology,
  findOneProduct,
} from "@/app/lib/@backend/action";
import { ProductUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;

  const product = await findOneProduct({
    id,
  });

  if (!product) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum Produto encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const [inputs, categories, technologies] = await Promise.all([
    findManyInput({}),
    findManyProductCategory({}),
    findManyTechnology({}),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de produto
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar um produto.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductUpdateForm
          product={product}
          inputs={inputs}
          categories={categories}
          technologies={technologies}
        />
      </div>
    </div>
  );
}
