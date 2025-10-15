import { findManyAutoTestLog } from "@/backend/action/production/auto-test-log.action";
import {IAutoTestLog} from "@/backend/domain/production/entity/auto-test-log.definition";
import { AutoTestLogSearchForm } from '@/frontend/ui/form/production/auto-test-log/search/search.auto-test-log.form';

import { DevicesAutoTestedTable } from "@/app/lib/@frontend/ui/table/production/devices-auto-tested/table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    query?: string;

    equipment?: string;
    technology?: string;
    status?: string[];
    user?: string;
    start_date?: Date;
    end_date?: Date;
  };
}
export default async function Example({ searchParams }: Props) {
  const filter = query(searchParams);
  const autoTestLog = await findManyAutoTestLog(filter);
  return (
    <div>
      <div className="border-b border-gray-900/10 pb-6 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Log de auto teste
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os registros de auto teste.
          </p>
        </div>

        <Link
          href="/production/tool/auto-test"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          title="Faça um novo auto teste"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo Auto Teste
        </Link>
      </div>
      <div className="border-b border-gray-900/10 pb-6  mt-6 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <AutoTestLogSearchForm filter={filter} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <DevicesAutoTestedTable data={autoTestLog} />
      </div>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IAutoTestLog> {
  const conditions: Filter<IAutoTestLog>[] = [];

  // Filtro geral com o parâmetro 'query'
  if (props.query) {
    const regex = { $regex: props.query, $options: "i" };
    conditions.push({
      $or: [
        { "technology.system_name": regex },
        { "equipment.imei": regex },
        { "equipment.firmware": regex },
        { "equipment.iccid": regex },
        { "equipment.serial": regex },
        { "user.name": regex },
      ],
    });
  }

  // Filtro específico para 'equipment'
  if (props.equipment) {
    const eqRegex = { $regex: props.equipment, $options: "i" };
    conditions.push({
      $or: [
        { "equipment.imei": eqRegex },
        { "equipment.serial": eqRegex },
        { "equipment.iccid": eqRegex },
        { "equipment.firmware": eqRegex },
      ],
    });
  }

  // Filtro específico para 'user'
  if (props.user) {
    const eqRegex = { $regex: props.user, $options: "i" };
    conditions.push({ "user.name": eqRegex });
  }

  // Filtro específico para 'technology'
  if (props.technology) {
    const eqRegex = { $regex: props.technology, $options: "i" };
    conditions.push({ "technology.system_name": eqRegex });
  }

  // Filtro específico para 'status'
  if (props.status) {
    // Converte as strings para booleanos ("true" => true, "false" => false)
    const statusBooleans = props.status.map((s) => s === "true");
    conditions.push({
      status: { $in: statusBooleans },
    });
  }

  // Filtro para intervalo de datas em 'created_at'
  if (props.start_date || props.end_date) {
    const dateFilter: { $gte?: Date; $lte?: Date } = {};
    if (props.start_date) {
      dateFilter.$gte = props.start_date;
    }
    if (props.end_date) {
      dateFilter.$lte = props.end_date;
    }
    conditions.push({
      created_at: dateFilter,
    });
  }

  // Combina as condições utilizando $and se houver mais de uma
  if (conditions.length === 1) {
    return conditions[0];
  }

  if (conditions.length > 1) {
    return { $and: conditions };
  }

  // Retorna um filtro vazio se não houver condições
  return {};
}

