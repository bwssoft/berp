"use client";

import { IInput } from "@/app/lib/@backend/domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  inputs: IInput[];
  currentInputIdSelected?: string;
}
export function InputSelect(props: Props) {
  const { inputs, currentInputIdSelected } = props;
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (id?: string) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("id", id);
    } else {
      params.delete("id");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <Select onValueChange={(id) => handleChange(id)}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione algum insumo para pesquisar" />
        </SelectTrigger>
        <SelectContent>
          {inputs.map((input) => (
            <SelectItem key={input.id} value={input.id}>
              {input.code} - {input.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
