"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import { Item } from "@/backend/domain/logistic/entity/item.entity";
import type { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import type { IInput } from "@/backend/domain/engineer/entity/input.definition";
import type { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { findManyInput } from "@/backend/action/engineer/input/input.action";
import { createOneItem } from "@/backend/action/logistic/item.action";
import { findManyProduct } from "@/backend/action/commercial/product/product.action";
import { findManyComponent } from "@/backend/action/engineer/component/component.action";

// Schema aprimorado com validação mais robusta
export const createItemSchema = z.object({
  type: z.nativeEnum(Item.Type, {
    required_error: "Selecione o tipo de item",
  }),
  selectedEntityId: z.string().min(1, "Selecione uma entidade"),
  ref: z.object({
    id: z.string().min(1, "ID obrigatório"),
    sku: z.string().min(1, "SKU obrigatório"),
    name: z.string().min(1, "Nome obrigatório"),
    color: z.string().min(1, "Cor obrigatória"),
    category: z.object({
      id: z.string().min(1, "Categoria obrigatória"),
    }),
  }),
});

export type CreateItemFormData = z.infer<typeof createItemSchema>;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function useCreateOneItemForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const form = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      type: undefined,
      selectedEntityId: "",
      ref: {
        id: "",
        sku: "",
        name: "",
        color: "",
        category: { id: "" },
      },
    },
    mode: "onChange",
  });

  const selectedType = form.watch("type");
  const selectedEntityId = form.watch("selectedEntityId");

  // Queries para buscar entidades
  const productQuery = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () =>
      findManyProduct({
        filter: debouncedSearch
          ? { name: { $regex: debouncedSearch, $options: "i" } }
          : {},
      }),
    enabled: selectedType === Item.Type.PRODUCT,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const componentQuery = useQuery({
    queryKey: ["components", debouncedSearch],
    queryFn: () =>
      findManyComponent({
        filter: debouncedSearch
          ? { name: { $regex: debouncedSearch, $options: "i" } }
          : {},
      }),
    enabled: selectedType === Item.Type.COMPONENT,
    staleTime: 5 * 60 * 1000,
  });

  const inputQuery = useQuery({
    queryKey: ["inputs", debouncedSearch],
    queryFn: () =>
      findManyInput({
        filter: debouncedSearch
          ? { name: { $regex: debouncedSearch, $options: "i" } }
          : {},
      }),
    enabled: selectedType === Item.Type.INPUT,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading =
    productQuery.isFetching ||
    componentQuery.isFetching ||
    inputQuery.isFetching;

  const availableEntities = (() => {
    if (selectedType === Item.Type.PRODUCT)
      return productQuery.data?.docs ?? [];
    if (selectedType === Item.Type.COMPONENT)
      return componentQuery.data?.docs ?? [];
    if (selectedType === Item.Type.INPUT) return inputQuery.data?.docs ?? [];
    return [];
  })() as Array<IProduct | IComponent | IInput>;

  // Reset campos quando tipo muda
  useEffect(() => {
    if (selectedType) {
      form.setValue("selectedEntityId", "", { shouldValidate: true });
      form.setValue(
        "ref",
        {
          id: "",
          sku: "",
          name: "",
          color: "",
          category: { id: "" },
        },
        { shouldValidate: true }
      );
      setSearchTerm("");
    }
  }, [selectedType, form]);

  // Atualiza ref quando entidade é selecionada
  useEffect(() => {
    if (selectedEntityId && availableEntities.length > 0) {
      const selectedEntity = availableEntities.find(
        (entity) => entity.id === selectedEntityId
      );

      if (selectedEntity) {
        form.setValue("ref", {
          id: selectedEntity.id,
          sku: selectedEntity.sku,
          name: selectedEntity.name,
          color: selectedEntity.color,
          category: { id: selectedEntity.category.id },
        });
      }
    }
  }, [selectedEntityId, availableEntities, form]);

  const getSelectedEntity = () => {
    return availableEntities.find((entity) => entity.id === selectedEntityId);
  };

  const onSubmit = async ({ ref, type }: CreateItemFormData) => {
    try {
      const { success, error } = await createOneItem({ ref, type });

      if (success) {
        toast({
          title: "Sucesso!",
          description: "Item registrado com sucesso!",
          variant: "success",
        });
        return;
      }

      if (error) {
        toast({
          title: "Erro!",
          description: error.usecase ?? "Falha ao registrar o item!",
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o item!",
        variant: "error",
      });
    }
  };

  const handleTypeChange = (type: Item.Type) => {
    form.setValue("type", type, { shouldValidate: true });
  };

  const handleEntitySelect = (entity: any) => {
    form.setValue("selectedEntityId", entity.id, { shouldValidate: true });
    form.setValue(
      "ref",
      {
        id: entity.id,
        sku: entity.sku,
        name: entity.name,
        color: entity.color,
        category: {
          id: entity.category.id,
        },
      },
      { shouldValidate: true }
    );
  };

  return {
    form,
    availableEntities,
    isLoading,
    onSubmit,
    searchTerm,
    setSearchTerm,
    selectedType,
    selectedEntityId,
    getSelectedEntity,
    handleTypeChange,
    handleEntitySelect,
    hasError:
      productQuery.isError || componentQuery.isError || inputQuery.isError,
    error: productQuery.error || componentQuery.error || inputQuery.error,
  };
}

