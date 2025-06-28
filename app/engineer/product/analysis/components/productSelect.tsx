"use client";

import { IProduct } from "@/app/lib/@backend/domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component";
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
    <Select onValueChange={(id) => handleChange(id)}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione algum produto para pesquisar" />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id}>
            {product.code} - {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
