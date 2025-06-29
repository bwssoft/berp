"use client";

import { Plus, Trash2, Package, Workflow } from "lucide-react";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { IBase, IItem } from "@/app/lib/@backend/domain";
import { MovementRowForm } from "./movement.row.form";
import { SortableItem } from "../../../../component";
import type { MovementBlock } from "./use-create.movement.form";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/app/lib/@frontend/ui/component";

interface MovementBlockFormProps {
  blockIndex: number;
  block: MovementBlock;
  items: IItem[];
  bases: IBase[];
  onAddMovement: () => void;
  onRemoveMovement: (movementIndex: number) => void;
  onReorderMovements: (fromIndex: number, toIndex: number) => void;
  onRemoveBlock: () => void;
  canRemoveBlock: boolean;
  totalBlocks: number;
}

export function MovementBlockForm({
  blockIndex,
  block,
  items,
  bases,
  onAddMovement,
  onRemoveMovement,
  onReorderMovements,
  onRemoveBlock,
  canRemoveBlock,
  totalBlocks,
}: MovementBlockFormProps) {
  const { watch } = useFormContext();
  const movements = watch(`blocks.${blockIndex}.movements`) || [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    if (block.type !== "RELATED") return;

    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = movements.findIndex(
        (movement: any) => movement.id === active.id
      );
      const newIndex = movements.findIndex(
        (movement: any) => movement.id === over.id
      );
      onReorderMovements(oldIndex, newIndex);
    }
  };

  const getBlockIcon = () => {
    return block.type === "RELATED" ? (
      <Workflow className="w-4 h-4" />
    ) : (
      <Package className="w-4 h-4" />
    );
  };

  const getBlockDescription = () => {
    if (block.type === "RELATED") {
      return "Movimentações em sequência ordenada. Arraste para reordenar.";
    }
    return "Movimentações independentes sem relação entre si.";
  };

  const renderMovements = () => {
    if (block.type === "RELATED") {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={movements.map((movement: any) => movement.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {movements.map((movement: any, movementIndex: number) => (
                <SortableItem key={movement.id} id={movement.id}>
                  <MovementRowForm
                    bases={bases}
                    items={items}
                    index={movementIndex}
                    onRemove={() => onRemoveMovement(movementIndex)}
                    canRemove={movements.length > 1}
                    totalMovements={movements.length}
                    blockIndex={blockIndex}
                    blockType={block.type}
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
    }

    // Para movimentações independentes, renderizar sem drag-and-drop
    return (
      <div className="space-y-3">
        {movements.map((movement: any, movementIndex: number) => (
          <MovementRowForm
            key={movement.id}
            bases={bases}
            items={items}
            index={movementIndex}
            onRemove={() => onRemoveMovement(movementIndex)}
            canRemove={movements.length > 1}
            totalMovements={movements.length}
            blockIndex={blockIndex}
            blockType={block.type}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getBlockIcon()}
            <div>
              <CardTitle className="flex items-center gap-2">
                {block.title}
                <Badge
                  variant={block.type === "RELATED" ? "default" : "secondary"}
                >
                  {block.type === "RELATED" ? "Sequencial" : "Independente"}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {getBlockDescription()}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {movements.length} mov{movements.length !== 1 ? "s" : ""}
            </Badge>

            {canRemoveBlock && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveBlock}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Headers para desktop */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-2 text-sm font-medium text-muted-foreground px-4">
          <div>{block.type === "RELATED" ? "Ordem / Item" : "Item"}</div>
          <div>Qtd</div>
          <div>Tipo</div>
          <div>Base</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {/* Lista de movimentações */}
        {renderMovements()}

        {/* Botão adicionar movimentação */}
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onAddMovement}
            className="w-fit border-dashed border-2 hover:border-solid"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar {block.type === "RELATED" ? "próxima" : "nova"}{" "}
            movimentação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
