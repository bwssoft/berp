"use client";

import {IComponentCategory} from "@/backend/domain/engineer/entity/component.category.definition";
import {IProduct} from "@/backend/domain/commercial/entity/product.definition";
import {ITechnology} from "@/backend/domain/engineer/entity/technology.definition";
import {} from "@/backend/domain/admin/entity/control.definition";
import { formatDate } from "@/app/lib/util";
import Link from "next/link";

type ProductsDetailsProps = {
  product: {
    id: string;
    name: string;
    category: Pick<IComponentCategory, "name" | "id">;
    technology: Pick<ITechnology, "name" | "id">;
    color: string;
    description?: string;
    created_at: Date;
    bom?: {
      input_id: string;
      input_name: string;
      quantity: number;
    }[];
  };
};

export function ProductsDetails({ product }: ProductsDetailsProps) {
  return (
    <div className="p-2">
      <div className="px-4 mb-6 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Produto
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Aba contendo informações do produto
        </p>
      </div>
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Nome do produto
          </dt>
          <dd className="flex gap-2 items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: product.color }}
            />
            <p className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {product.name}
            </p>
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Tecnologia
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {product.technology.name.brand}
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Categoria
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {product.category.name}
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Descrição
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {product.description}
          </dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Data de criação
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {formatDate(new Date(product.created_at), {
              includeHours: true,
            })}
          </dd>
        </div>
      </dl>
    </div>
  );
}
