"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Button,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../../../component";
import { useSectorModal } from "../../../../modal/comercial/sector";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/lib/@frontend/ui/component/form";

type FilterFormData = {
    client?: string;
    document?: string;
    sector?: string;
    status?: string;
    billingSituation?: string;
};

export function AccountFilterForm() {
    const form = useForm<FilterFormData>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const searchParams = useSearchParams();
    const sectorModal = useSectorModal();

    function onSubmit(data: FilterFormData) {
        const params = new URLSearchParams(searchParams.toString());

        data.client
            ? params.set("client", data.client)
            : params.delete("client");
        data.document
            ? params.set("document", data.document)
            : params.delete("document");
        data.sector
            ? params.set("sector", data.sector)
            : params.delete("sector");
        data.status && data.status !== "Todos"
            ? params.set("status", data.status)
            : params.delete("status");
        data.billingSituation && data.billingSituation !== "Todos"
            ? params.set("billingSituation", data.billingSituation)
            : params.delete("billingSituation");

        params.delete("page");
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }

    function handleClear() {
        form.reset();
        startTransition(() => {
            router.push("?");
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full border p-4 rounded shadow-sm space-y-4"
            >
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">Conta</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Cliente */}
                    <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite a Razão Social ou Nome Fantasia"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* CPF/CNPJ */}
                    <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF/CNPJ</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite o CPF ou CNPJ"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Setor */}
                    <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Setor</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o setor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectorModal.enabledSectors.map(
                                                (sector) => (
                                                    <SelectItem
                                                        key={sector.id}
                                                        value={sector.name}
                                                    >
                                                        {sector.name}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status Faturamento */}
                    {/* <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Faturamento</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

                    {/* Situação Faturamento */}
                    {/* <FormField
            control={form.control}
            name="billingSituation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação Faturamento</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adimplente">Adimplente</SelectItem>
                      <SelectItem value="Inadimplente">Inadimplente</SelectItem>
                      <SelectItem value="Inadimplente/Bloqueado">
                        Inadimplente/Bloqueado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        disabled={isPending}
                    >
                        Limpar
                    </Button>
                    <Button
                        type="submit"
                        variant="default"
                        disabled={isPending}
                    >
                        {isPending ? "Buscando..." : "Pesquisar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
