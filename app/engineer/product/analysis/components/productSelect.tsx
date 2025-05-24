"use client";

import { IProduct } from "@/app/lib/@backend/domain";
import { Select } from "@/app/lib/@frontend/ui/component";
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
      keyExtractor={(i) => i.id}
      valueExtractor={(i) => i.name}
      labelExtractor={(i) => i.name}
      onChange={(i) => handleChange(i.id)}
      name="product-select"
      placeholder="Selecione algum produto para pesquisar"
    />
  );
}
