import { findOneTechnology } from "@/app/lib/@backend/action";
import { AutoTestPanel } from "./@components/auto-test";

interface Props {
  searchParams: {
    technology_id?: string;
  };
}

export default async function Page(props: Props) {
  const date = new Date();

  const {
    searchParams: { technology_id },
  } = props;

  const technology = await findOneTechnology({
    id: technology_id,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 ">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Configurador
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ferramenta para testar
            <a href="#" className="text-gray-900">
              dispositivos IoT.
            </a>{" "}
            Data de hoje:{" "}
            <time dateTime={date.toLocaleDateString()}>
              {date.toLocaleDateString()}
            </time>
          </p>
        </div>
      </div>
      <AutoTestPanel technology={technology} />
    </div>
  );
}
