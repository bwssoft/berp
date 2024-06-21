export default async function Page() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Estoque dos insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma tabela é apresentada com a quantidade de cada insumo. É
            atualizada a cada 24h a partir das transações realizadas no dia.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6"></div>
    </div>
  );
}
