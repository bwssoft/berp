import { findAllProduct } from "@/app/lib/action";
import ProductTransactionCreateForm from "@/app/ui/form/product-transaction/product-transaction.create.form";

export default async function Page() {
  const products = await findAllProduct();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Entradas e Saídas
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar a entrada ou saída de um
            produto.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductTransactionCreateForm products={products} />
      </div>
    </div>
  );
}