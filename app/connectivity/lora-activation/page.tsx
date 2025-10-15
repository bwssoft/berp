import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { findManyTechnology } from "@/backend/action/engineer/technology.action";
import { LoraActivationModal } from "@/app/lib/@frontend/ui/modal/connectivity/lora-activation/lora-activation.modal";
import { ActivateList } from "./activate-list";

interface Props {
  searchParams: {
    on_model?: string | undefined;
    on_serial?: string | undefined;
    off_model?: string | undefined;
    off_serial?: string | undefined;
  };
}

export default async function LoraActivation(props: Props) {
  const { searchParams } = props;
  const technologies = await findManyTechnology({
    "name.system": { $regex: "LORA" },
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ativação LoRa
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a ativação de chaves LoRa.
          </p>
        </div>
        <LoraActivationModal />
      </div>

      <Separator />

      {/* Table Section */}
      <div className="flex gap-6">
        <ActivateList
          activate={true}
          technologies={technologies}
          searchParams={{
            model: searchParams.on_model,
            serial: searchParams.on_serial,
          }}
        />
        <ActivateList
          activate={false}
          technologies={technologies}
          searchParams={{
            model: searchParams.off_model,
            serial: searchParams.off_serial,
          }}
        />
      </div>
    </div>
  );
}

