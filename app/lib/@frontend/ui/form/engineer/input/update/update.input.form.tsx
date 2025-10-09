"use client";

import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Label } from '@/frontend/ui/component/label';
import { Textarea } from '@/frontend/ui/component/text-area';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/lib/@frontend/ui/component/form";
import { Trash2, Plus, Loader2 } from "lucide-react";
import {IInput} from "@/backend/domain/engineer/entity/input.definition";
import {IInputCategory} from "@/backend/domain/engineer/entity/input.category.definition";
import { useUpdateInputForm } from "./use-update.input.form";

interface Props {
  categories: IInputCategory[];
  input: IInput;
}
export function UpdateOneInputForm(props: Props) {
  const { categories, input } = props;
  const {
    form,
    addSpecEntry,
    removeSpecEntry,
    updateSpecEntry,
    addFileEntry,
    removeFileEntry,
    updateFileEntry,
    handleSubmit,
    loading,
    specEntries,
    fileEntries,
    handleCancel,
  } = useUpdateInputForm({ defaultValues: input });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do insumo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      const selected = categories.find(
                        (category) => category.id === val
                      );
                      field.onChange(selected); // Aqui passa o objeto para o react-hook-form
                    }}
                    value={field.value?.id} // Aqui mantém controlado pelo id
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id} // Só passa o id aqui!
                        >
                          {category.code} - {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cor */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        {...field}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preço */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Especificações */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Especificações</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecEntry}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {specEntries.map((entry, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Chave"
                    value={entry.key}
                    onChange={(e) =>
                      updateSpecEntry(index, "key", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valor"
                    value={entry.value}
                    onChange={(e) =>
                      updateSpecEntry(index, "value", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSpecEntry(index)}
                    disabled={specEntries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Arquivos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Arquivos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFileEntry}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {fileEntries.map((file, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Nome do arquivo ou URL"
                    value={file}
                    onChange={(e) => updateFileEntry(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFileEntry(index)}
                    disabled={fileEntries.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o insumo..."
                    rows={3}
                    {...field}
                  />
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleCancel()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}

