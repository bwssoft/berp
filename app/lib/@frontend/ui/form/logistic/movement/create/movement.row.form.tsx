"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
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
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Textarea } from '@/frontend/ui/component/text-area';
import { Badge } from '@/frontend/ui/component/badge';

import type { CreateMovementFormData } from "./use-create.movement.form";
import type {IBase} from "@/backend/domain/logistic/entity/base.entity";
import type {IItem} from "@/backend/domain/logistic/entity/item.entity";
import { movementConstants } from "@/app/lib/constant/logistic";

interface MovementRowFormProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  items: IItem[];
  bases: IBase[];
  totalMovements: number;
  blockIndex: number;
  blockType: "RELATED" | "INDEPENDENT";
  dragHandleProps?: any;
  isDragging?: boolean;
}

export function MovementRowForm({
  index,
  onRemove,
  canRemove,
  items,
  bases,
  totalMovements,
  blockIndex,
  blockType,
  dragHandleProps,
  isDragging = false,
}: MovementRowFormProps) {
  const { control } = useFormContext<CreateMovementFormData>();
  const [showDetails, setShowDetails] = useState(false);

  const sequenceNumber = index + 1;
  const isFirst = index === 0;
  const isLast = index === totalMovements - 1;

  return (
    <div
      className={`border rounded-2xl p-4 space-y-3 bg-card shadow-sm transition-all duration-200 ${
        isDragging ? "shadow-lg scale-105 rotate-1" : ""
      }`}
    >
      {/* Header com indicador de sequência */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Drag Handle - apenas para blocos RELATED */}
          {blockType === "RELATED" && (
            <div
              {...dragHandleProps}
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          <Badge variant="outline" className="font-mono text-sm">
            {blockType === "RELATED"
              ? `#${sequenceNumber}`
              : `Mov ${sequenceNumber}`}
          </Badge>

          {/* Indicadores de posição - apenas para blocos RELATED */}
          {blockType === "RELATED" && (
            <div className="flex gap-1">
              {isFirst && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-700"
                >
                  Início
                </Badge>
              )}
              {isLast && totalMovements > 1 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-700"
                >
                  Fim
                </Badge>
              )}
              {!isFirst && !isLast && totalMovements > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-700"
                >
                  Intermediária
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Sequência visual - apenas para blocos RELATED */}
        {blockType === "RELATED" && totalMovements > 1 && (
          <div className="text-xs text-muted-foreground">
            {sequenceNumber} de {totalMovements}
          </div>
        )}
      </div>

      {/* Linha principal compacta */}
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-2 items-start">
        {/* Item */}
        <FormField
          control={control}
          name={`blocks.${blockIndex}.movements.${index}.item`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const item = items.find((el) => el.id === value);
                    field.onChange(item);
                  }}
                  defaultValue={field?.value?.id}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex-1">
                          <div className="font-medium">{item.ref.name}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-mono">{item.ref.sku}</span>
                          </div>
                        </div>
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
          name={`blocks.${blockIndex}.movements.${index}.quantity`}
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
          name={`blocks.${blockIndex}.movements.${index}.type`}
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
          name={`blocks.${blockIndex}.movements.${index}.base`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const base = bases.find((el) => el.id === value);
                    field.onChange(base);
                  }}
                  defaultValue={field?.value?.id}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.sku}
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
          name={`blocks.${blockIndex}.movements.${index}.status`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Status" />
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
              name={`blocks.${blockIndex}.movements.${index}.description`}
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

