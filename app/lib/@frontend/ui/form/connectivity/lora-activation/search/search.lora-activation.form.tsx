"use client";

import { TrashIcon } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../component";
import {
  Props,
  useSearchLoraActivationForm,
} from "./use-search.lora-activation.form";

export function LoraActivationSearchForm(props: Props) {
  const { technologies } = props;

  const {
    register,
    handleChangeSerial,
    handleChangeModel,
    handleClearForm,
    watch,
  } = useSearchLoraActivationForm(props);

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Pesquise pelo serial"
        {...register("serial")}
        onChange={handleChangeSerial}
      />
      <Select value={watch("model")} onValueChange={handleChangeModel}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o modelo" />
        </SelectTrigger>
        <SelectContent>
          {technologies.map((technology) => (
            <SelectItem key={technology.id} value={technology.name.system}>
              {technology.name.brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        onClick={handleClearForm}
        variant={"ghost"}
        title="Limpar pesquisa"
      >
        <TrashIcon />
      </Button>
    </div>
  );
}
