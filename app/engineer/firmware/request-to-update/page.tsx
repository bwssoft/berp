import { findAllRequestToUpdate } from "@/app/lib/@backend/action/engineer/firmware/request-to-update.action";
import { FirmwareRequestToUpdateTable } from "@/app/lib/@frontend/ui/table/engineer/firmware-request-to-update/table";

export default async function Example() {
  const requests = await findAllRequestToUpdate();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gestão de requisições para atualização
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os firmwares que foram requisitados para
            download.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <FirmwareRequestToUpdateTable data={requests} />
      </div>
    </div>
  );
}
