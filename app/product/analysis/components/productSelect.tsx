"use client";

import { IProduct } from "@/app/lib/definition";
import { Select } from "@/app/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  products: IProduct[];
  currentProductIdSelected?: string;
}
export function ProductSelect(props: Props) {
  const { products, currentProductIdSelected } = props;
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
      data={products}
      keyExtractor={(i) => i.id!}
      valueExtractor={(i) => i.id!}
      labelExtractor={(i) => i.name}
      onChangeSelect={(i) => handleChange(i?.id)}
      defaultValue={currentProductIdSelected ?? undefined}
      placeholder="Selecione algum produto para pesquisar"
    />
  );
}
