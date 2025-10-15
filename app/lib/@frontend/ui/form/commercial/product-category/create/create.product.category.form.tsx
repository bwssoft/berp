"use client";

import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/lib/@frontend/ui/component/form";
import { Loader2 } from "lucide-react";
import { useCreateOneProductCategoryForm } from "./use-create.product.category.form";

export function CreateOneProductCategoryForm() {
  const { form, handleSubmit, handleCancel } =
    useCreateOneProductCategoryForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o código da categoria"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da categoria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-6 border-t border-gray-900/10">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Salvar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleCancel()}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
