"use client";

import { Save, Workflow, Package } from "lucide-react";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Form } from "@/app/lib/@frontend/ui/component/form";
import { useCreateMovementForm } from "./use-create.movement.form";
import { MovementBlockForm } from "./movement-block-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import type {IBase} from "@/backend/domain/logistic/entity/base.entity";
import type {IItem} from "@/backend/domain/logistic/entity/item.entity";
import Link from "next/link";

interface Props {
  items: IItem[];
  bases: IBase[];
}

export function CreateMovementForm(props: Props) {
  const { items, bases } = props;
  const {
    methods,
    blocks,
    addRelatedBlock,
    addIndependentBlock,
    addMovementToBlock,
    removeMovementFromBlock,
    reorderMovementsInBlock,
    removeMovementBlock,
    getTotalMovements,
    onSubmit,
  } = useCreateMovementForm();

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Header com ações principais */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Movimentações</CardTitle>
            <CardDescription>
              Organize suas movimentações em sequências relacionadas ou registre
              movimentações independentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={addRelatedBlock}
                className="flex-1"
              >
                <Workflow className="w-4 h-4 mr-2" />
                Adicionar sequência de movimentações
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={addIndependentBlock}
                className="flex-1"
              >
                <Package className="w-4 h-4 mr-2" />
                Adicionar movimentação independente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blocos de movimentações */}
        <div className="space-y-6">
          {blocks.map((block, blockIndex) => (
            <MovementBlockForm
              key={block.id}
              blockIndex={blockIndex}
              block={methods.getValues(`blocks.${blockIndex}`)}
              items={items}
              bases={bases}
              onAddMovement={() => addMovementToBlock(blockIndex)}
              onRemoveMovement={(movementIndex) =>
                removeMovementFromBlock(blockIndex, movementIndex)
              }
              onReorderMovements={(fromIndex, toIndex) =>
                reorderMovementsInBlock(blockIndex, fromIndex, toIndex)
              }
              onRemoveBlock={() => removeMovementBlock(blockIndex)}
              canRemoveBlock={blocks.length > 1}
              totalBlocks={blocks.length}
            />
          ))}
        </div>

        {/* Resumo e ações do formulário */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">Resumo:</div>
                <div>
                  {blocks.length} bloco{blocks.length > 1 ? "s" : ""} •{" "}
                  {getTotalMovements()} movimentação
                  {getTotalMovements() > 1 ? "ões" : ""} para registro
                </div>
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
                    : `Registrar (${getTotalMovements()})`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

