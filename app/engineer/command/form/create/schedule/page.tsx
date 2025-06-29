import { findAllCommand } from "@/app/lib/@backend/action/engineer/command/command.action";
import { findAllDevice } from "@/app/lib/@backend/action/engineer/device.action";
import { findAllFirmware } from "@/app/lib/@backend/action/engineer/firmware/firmware.action";
import { ScheduleCreateForm } from "@/app/lib/@frontend/ui/component";

export default async function Page() {
  const commands = await findAllCommand();
  const firmwares = await findAllFirmware();
  const devices = await findAllDevice();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de agendamento de comando
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar um agendamento de
            comando.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ScheduleCreateForm
          commands={commands}
          devices={devices}
          firmwares={firmwares}
        />
      </div>
    </div>
  );
}
