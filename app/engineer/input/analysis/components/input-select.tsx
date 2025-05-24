"use client";

import { IInput } from "@/app/lib/@backend/domain";
import { Select } from "@/app/lib/@frontend/ui/component";
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
    <Select
      data={inputs}
      keyExtractor={(i) => i.id}
      valueExtractor={(i) => i.name}
      labelExtractor={(i) => i.name}
      name="input-select"
      onChange={(i) => handleChange(i.id)}
      placeholder="Selecione algum insumo para pesquisar"
    />
  );
}
