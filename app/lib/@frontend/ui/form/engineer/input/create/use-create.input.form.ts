"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, IInput } from "@/app/lib/@backend/domain";
import { createOneInput } from "@/app/lib/@backend/action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/lib/@frontend/hook";

// Schema de validação com Zod
const inputSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Quantidade de caracteres excedida (100)"),
  category: z.object({
    id: z.string(),
    code: z.string(),
  }),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Formato de cor inválido (#RRGGBB)"
    ),
  spec: z.record(z.string()).default({}),
  files: z.array(z.string()).default([]),
  description: z.string().max(500, "Descrição muito longa").optional(),
  price: z.coerce.number().min(0, "Preço deve ser positivo"),
  manufacturer: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
      })
    )
    .default([]),
  active: z.boolean().default(true),
});

export type CreateInputFormData = z.infer<typeof inputSchema>;

export function useCreateInputForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [specEntries, setSpecEntries] = useState<
    Array<{ key: string; value: string }>
  >([{ key: "", value: "" }]);
  const [fileEntries, setFileEntries] = useState<string[]>([""]);

  const form = useForm<CreateInputFormData>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      name: "",
      category: undefined as unknown as IInput["category"],
      color: "#000000",
      spec: {},
      files: [],
      description: "",
      price: 0,
      active: true,
    },
  });

  const handleSubmit = form.handleSubmit(async (data: CreateInputFormData) => {
    setLoading(true);

    // Filtrar spec entries vazias
    const filteredSpec = specEntries
      .filter((entry) => entry.key.trim() && entry.value.trim())
      .reduce(
        (acc, entry) => {
          acc[entry.key] = entry.value;
          return acc;
        },
        {} as Record<string, string>
      );

    const filteredFiles = fileEntries.filter((file) => file.trim());

    const formData = {
      ...data,
      spec: filteredSpec,
      files: filteredFiles,
      price: data.price,
    };

    try {
      const { success, error } = await createOneInput(formData);

      if (success) {
        toast({
          title: "Sucesso!",
          description: "Inpute registrada com sucesso!",
          variant: "success",
        });
        router.push("/engineer/input/management");
        return;
      }

      if (error) {
        Object.entries(error).forEach(([key, message]) => {
          if (key !== "global" && message) {
            form.setError(key as keyof CreateInputFormData, {
              type: "manual",
              message: message as string,
            });
          }
        });
        toast({
          title: "Erro!",
          description: error.usecase ?? "Falha ao registrar o inpute!",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o inpute!",
        variant: "error",
      });
    }
  });

  const addSpecEntry = () => {
    setSpecEntries([...specEntries, { key: "", value: "" }]);
  };

  const removeSpecEntry = (index: number) => {
    if (specEntries.length > 1) {
      setSpecEntries(specEntries.filter((_, i) => i !== index));
    }
  };

  const updateSpecEntry = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...specEntries];
    updated[index][field] = value;
    setSpecEntries(updated);
  };

  const addFileEntry = () => {
    setFileEntries([...fileEntries, ""]);
  };

  const removeFileEntry = (index: number) => {
    if (fileEntries.length > 1) {
      setFileEntries(fileEntries.filter((_, i) => i !== index));
    }
  };

  const updateFileEntry = (index: number, value: string) => {
    const updated = [...fileEntries];
    updated[index] = value;
    setFileEntries(updated);
  };

  function handleCancelCreate() {
    router.push("/engineer/input/management");
  }

  return {
    form,
    handleSubmit,
    schema: inputSchema,
    addSpecEntry,
    removeSpecEntry,
    updateSpecEntry,
    addFileEntry,
    removeFileEntry,
    updateFileEntry,
    loading,
    specEntries,
    fileEntries,
    handleCancelCreate,
  };
}
