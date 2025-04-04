import { findManyIdentificationLog } from "@/app/lib/@backend/action";
import {
  DevicesIdentifiedTable,
  IdentificationLogSearchForm,
} from "@/app/lib/@frontend/ui/component";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface Props {
  searchParams: {
    equipment_imei?: string;
    equipment_serial?: string;
    technology_name?: string;
    status?: string[];
    user_name?: boolean;
    start_date?: Date;
    end_date?: Date;
  };
}
export default async function Example({ searchParams }: Props) {
  const autoTestLog = await findManyIdentificationLog(query(searchParams));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Log de identificação
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os registros de identificação.
          </p>
        </div>

        <Link
          href="/production/tool/identificator"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Nova Identificação
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <IdentificationLogSearchForm />
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <DevicesIdentifiedTable data={autoTestLog} />
      </div>
    </div>
  );
}

const query = ({
  equipment_imei,
  equipment_serial,
  status,
  technology_name,
  user_name,
  start_date,
  end_date,
}: Props["searchParams"]) => {
  // Inicializa a query como um objeto vazio
  const query: any = {};

  // Monta as condições de busca para os campos de equipamentos e tecnologia
  const orConditions = [];
  if (equipment_imei) {
    orConditions.push({
      "after.imei": { $regex: equipment_imei, $options: "i" },
    });
    orConditions.push({
      "before.imei": { $regex: equipment_imei, $options: "i" },
    });
  }
  if (equipment_serial) {
    orConditions.push({
      "after.serial": { $regex: equipment_serial, $options: "i" },
    });
    orConditions.push({
      "before.serial": { $regex: equipment_serial, $options: "i" },
    });
  }
  if (technology_name) {
    orConditions.push({
      "technology.system_name": { $regex: technology_name, $options: "i" },
    });
  }
  if (user_name) {
    orConditions.push({
      "user.name": { $regex: user_name, $options: "i" },
    });
  }

  // Só adiciona o operador $or se houver alguma condição definida
  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  // Adiciona a condição de status se o array existir e possuir itens
  if (status && status.length > 0) {
    query.status = {
      $in: (status ?? []).map((i) => (i === "false" ? false : true)),
    };
  }

  // Adiciona as condições de data
  if (start_date || end_date) {
    query.created_at = {};
    if (start_date) {
      query.created_at.$gte = start_date;
    }
    if (end_date) {
      query.created_at.$lte = end_date;
    }
  }
  return query;
};
