"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component/select";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/app/lib/@frontend/ui/component/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/lib/@frontend/ui/component/collapsible";
import { CreateMovementFormData } from "./use-create.movement.form";
import { Button, Input, Textarea } from "../../../../component";
import { IBase, IItem } from "@/app/lib/@backend/domain";
import { movementConstants } from "@/app/lib/constant/logistic";

interface MovementRowFormProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  items: IItem[];
  bases: IBase[];
}

export function MovementRowForm({
  index,
  onRemove,
  canRemove,
  items,
  bases,
}: MovementRowFormProps) {
  const { control } = useFormContext<CreateMovementFormData>();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      {/* Linha principal compacta */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-2 items-start">
        {/* Item */}
        <FormField
          control={control}
          name={`movements.${index}.item`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const item = items.find((el) => el.id === value);
                    field.onChange(item);
                  }}
                  defaultValue={field.value.id}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.ref.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantidade */}
        <FormField
          control={control}
          name={`movements.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Qtd"
                  className="h-9"
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

        {/* Tipo */}
        <FormField
          control={control}
          name={`movements.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(movementConstants.type)
                      .map(([key, value]) => ({
                        label: value,
                        value: key,
                      }))
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Base */}
        <FormField
          control={control}
          name={`movements.${index}.base`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const base = bases.find((el) => el.id === value);
                    field.onChange(base);
                  }}
                  defaultValue={field.value.id}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={control}
          name={`movements.${index}.status`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(movementConstants.status)
                      .map(([key, value]) => ({
                        label: value,
                        value: key,
                      }))
                      .map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ações */}
        <div className="flex items-center gap-1">
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
              >
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Detalhes expansíveis */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleContent className="space-y-3">
          <div className="border-t pt-3">
            <FormField
              control={control}
              name={`movements.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição ou observações (opcional)..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
