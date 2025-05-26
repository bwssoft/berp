"use client";

import { Plus, Save } from "lucide-react";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Form } from "@/app/lib/@frontend/ui/component/form";
import { useCreateMovementForm } from "./use-create.movement.form";
import { MovementRowForm } from "./movement.row.form";
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
import { IBase, IItem } from "@/app/lib/@backend/domain";
import Link from "next/link";
import { SortableItem } from "../../../../component";

interface Props {
  items: IItem[];
  bases: IBase[];
}
export function CreateMovementForm(props: Props) {
  const { items, bases } = props;
  const {
    methods,
    fields,
    addMovement,
    removeMovement,
    reorderMovements,
    onSubmit,
  } = useCreateMovementForm();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      reorderMovements(oldIndex, newIndex);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Movimentações ({fields.length})</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMovement}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardTitle>
            <CardDescription>
              Arraste as movimentações para reordená-las. A sequência define
              automaticamente o fluxo logístico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Headers para desktop */}
            <div className="hidden lg:grid lg:grid-cols-6 gap-2 text-sm font-medium text-muted-foreground px-4">
              <div>Ordem / Item</div>
              <div>Qtd</div>
              <div>Tipo</div>
              <div>Base</div>
              <div>Status</div>
              <div>Ações</div>
            </div>

            {/* Lista de movimentações com drag-and-drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <SortableItem key={field.id} id={field.id}>
                      <MovementRowForm
                        bases={bases}
                        items={items}
                        index={index}
                        onRemove={() => removeMovement(index)}
                        canRemove={fields.length > 1}
                        totalMovements={fields.length}
                      />
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Botão adicionar centralizado */}
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={addMovement}
                className="w-fit border-dashed border-2 hover:border-solid"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar nova movimentação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ações do formulário */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">
            {fields.length} movimentação{fields.length > 1 ? "ões" : ""}
            {fields.length > 1 ? "s" : ""} para registro
          </div>

          <div className="flex gap-3">
            <Link href="/logistic/movement">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              disabled={methods.formState.isSubmitting}
              className="min-w-[200px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {methods.formState.isSubmitting
                ? "Registrando..."
                : `Registrar (${fields.length})`}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
