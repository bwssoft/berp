"use client";

import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/lib/@frontend/ui/component/form";
import { Input } from "@/app/lib/@frontend/ui/component/input";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import {
  Alert,
  AlertDescription,
} from "@/app/lib/@frontend/ui/component/alert";
import {
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Package,
  Cpu,
} from "lucide-react";
import { Item } from "@/app/lib/@backend/domain";
import { useCreateOneItemForm } from "./use-create.item.form";
import { cn } from "@/app/lib/util";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component/select";

const typeOptions = [
  {
    value: Item.Type.PRODUCT,
    label: "Produto",
    description: "Produtos finais para venda",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  {
    value: Item.Type.INPUT,
    label: "Insumo",
    description: "Matérias-primas e insumos",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Wrench,
  },
  {
    value: Item.Type.COMPONENT,
    label: "Componente",
    description: "Componentes e peças",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Cpu,
  },
];

export function CreateOneItemForm() {
  const {
    form,
    availableEntities,
    isLoading,
    onSubmit,
    searchTerm,
    setSearchTerm,
    selectedType,
    selectedEntityId,
    getSelectedEntity,
    handleEntitySelect,
    hasError,
    error,
  } = useCreateOneItemForm();

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (error) {
      console.error("Erro ao criar item:", error);
      // Aqui você pode adicionar uma notificação de erro
    }
  };

  const selectedEntity = getSelectedEntity();

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (e) => console.log(e))}
              className="space-y-6"
            >
              {/* Seleção de Tipo */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Entidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de entidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 justify-center">
                                <option.icon className="size-5" />
                                <div className="flex flex-col items-start">
                                  <div className="font-medium">
                                    {option.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de Busca */}
              {selectedType && (
                <div className="space-y-3">
                  <FormLabel>Buscar Entidade</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder={`Buscar ${typeOptions.find((t) => t.value === selectedType)?.label.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Lista de Entidades */}
              {selectedType && (
                <FormField
                  control={form.control}
                  name="selectedEntityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecionar Entidade</FormLabel>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {isLoading && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2 text-sm">Carregando...</span>
                          </div>
                        )}

                        {hasError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Erro ao carregar entidades. Tente novamente.
                            </AlertDescription>
                          </Alert>
                        )}

                        {!isLoading &&
                          !hasError &&
                          availableEntities.length === 0 && (
                            <div className="text-center p-4 text-muted-foreground">
                              {searchTerm
                                ? "Nenhuma entidade encontrada para a busca."
                                : "Nenhuma entidade disponível."}
                            </div>
                          )}

                        {!isLoading &&
                          availableEntities.map((entity) => (
                            <button
                              key={entity.id}
                              type="button"
                              className={cn(
                                "w-full text-left p-3 border rounded-lg transition-all hover:shadow-sm",
                                selectedEntityId === entity.id
                                  ? "border-gray-300 bg-muted shadow-sm"
                                  : "hover:border-gray-300"
                              )}
                              onClick={() => handleEntitySelect(entity)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {entity.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-mono">
                                      {entity.sku}
                                    </span>
                                  </div>
                                </div>
                                {selectedEntityId === entity.id && (
                                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !form.formState.isValid}
              >
                Criar Item
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview do Item */}
      {selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Preview do Item
              <Badge variant="outline">
                {typeOptions.find((t) => t.value === selectedType)?.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    SKU:
                  </span>
                  <p className="font-mono">{selectedEntity.sku}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Nome:
                  </span>
                  <p className="font-medium">{selectedEntity.name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Cor:
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        backgroundColor: selectedEntity.color.toLowerCase(),
                      }}
                    />
                    <span>{selectedEntity.color}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Categoria:
                  </span>
                  <p>{selectedEntity.category.code}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
