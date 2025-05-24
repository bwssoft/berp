"use client";

import { Plus, Save } from "lucide-react";
import { Button, Form } from "../../../../component";
import { useCreateMovementForm } from "./use-create.movement.form";
import Link from "next/link";
import { MovementRowForm } from "./movement.row.form";
import { IBase, IItem } from "@/app/lib/@backend/domain";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../component/card";

interface Props {
  items: IItem[];
  bases: IBase[];
}
export function CreateMovementForm(props: Props) {
  const { items, bases } = props;
  const { methods, fields, addMovement, removeMovement, onSubmit } =
    useCreateMovementForm();

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
              Preencha os campos principais. Use o botão ▼ para adicionar
              descrições opcionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Headers para desktop */}
            <div className="hidden lg:grid lg:grid-cols-6 gap-2 text-sm font-medium text-muted-foreground px-4">
              <div>Item</div>
              <div>Qtd</div>
              <div>Tipo</div>
              <div>Base</div>
              <div>Status</div>
              <div>Ações</div>
            </div>

            {/* Lista de movimentações */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <MovementRowForm
                  bases={bases}
                  items={items}
                  key={field.id}
                  index={index}
                  onRemove={() => removeMovement(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>

            {/* Botão adicionar centralizado */}
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={addMovement}
                className="w-full max-w-md border-dashed border-2 hover:border-solid"
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
