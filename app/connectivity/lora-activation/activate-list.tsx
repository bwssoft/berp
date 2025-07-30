import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import { findManyDevice } from "@/app/lib/@backend/action/engineer/device.action";
import { Device, ITechnology } from "@/app/lib/@backend/domain";
import { DeviceActivationTable } from "@/app/lib/@frontend/ui/table/connectivity/device-activation-table/table";
import { LoraActivationSearchForm } from "@/app/lib/@frontend/ui/form/connectivity/lora-activation/search/search.lora-activation.form";

interface Props {
  activate: boolean;
  technologies: ITechnology[];
  searchParams: {
    serial?: string | undefined;
    model?: string | undefined;
  };
}

export async function ActivateList(props: Props) {
  const {
    activate,
    technologies,
    searchParams: { serial, model },
  } = props;

  const title = `Dispositivos ${activate ? "ON" : "OFF"}`;
  const subtitle = `Visualize e gerencie todos os dispositivos ${activate ? "on" : "off"}`;

  const query: any = {
    model: {
      $in: [Device.Model.DM_BWS_LORA, Device.Model.DM_BWS_NB2_LORA],
    },
  };

  if (serial) {
    query["equipment.serial"] = { $regex: serial, $options: "i" };
  }

  if (model) {
    query.model = model;
  }

  const devices = await findManyDevice(query);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
        <LoraActivationSearchForm
          activate={activate}
          technologies={technologies}
          searchParams={{ serial, model }}
        />
      </CardHeader>
      <CardContent className="p-0">
        <DeviceActivationTable data={devices} activate={activate} />
      </CardContent>
    </Card>
  );
}
