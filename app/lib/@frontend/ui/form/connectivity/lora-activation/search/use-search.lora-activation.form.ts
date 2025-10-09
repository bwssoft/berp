import {ITechnology} from "@/backend/domain/engineer/entity/technology.definition";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

export interface Props {
  technologies: ITechnology[];
  activate: boolean;
  searchParams: {
    serial?: string | undefined;
    model?: string | undefined;
  };
}

export function useSearchLoraActivationForm(props: Props) {
  const prefix = props.activate ? "on_" : "off_";

  const { handleParamsChange } = useHandleParamsChange();

  const form = useForm({
    defaultValues: {
      serial: props.searchParams?.serial ?? "",
      model: props.searchParams?.model ?? "",
    },
  });

  const serial = form.watch("serial");
  const model = form.watch("model");

  useEffect(() => {
    handleParamsChange({
      [prefix + "serial"]: serial,
      [prefix + "model"]: model,
    });
  }, [serial, model]);

  const handleChangeSerial = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("serial", e.target.value);
  };

  const handleChangeModel = (value: string) => {
    form.setValue("model", value);
  };

  const handleClearForm = () => {
    form.setValue("serial", "");
    form.setValue("model", "");
  };

  return {
    ...form,
    handleChangeSerial,
    handleChangeModel,
    handleClearForm,
  };
}

