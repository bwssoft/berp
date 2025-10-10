"use client";

import { Button, Input, Label } from "../../../../component";
import { Plus, Trash2 } from "lucide-react";

export interface PriceTier {
  id: string;
  from: string;
  to: string;
  pricePerUnit: string;
  isLast?: boolean;
}

interface PriceTierInputProps {
  tiers: PriceTier[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof PriceTier, value: string) => void;
}

export function PriceTierInput({
  tiers,
  onAdd,
  onRemove,
  onUpdate,
}: PriceTierInputProps) {
  return (
    <div className="space-y-4">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className="flex items-end gap-4 p-4 border rounded-lg"
        >
          <div className="flex-1 space-y-2">
            <Label className="text-sm">
              {tier.isLast ? "A partir de:" : "De:"}
            </Label>
            <Input
              value={tier.from}
              onChange={(e) => onUpdate(tier.id, "from", e.target.value)}
              placeholder="0"
            />
          </div>

          {!tier.isLast && (
            <div className="flex-1 space-y-2">
              <Label className="text-sm">Até:</Label>
              <Input
                value={tier.to}
                onChange={(e) => onUpdate(tier.id, "to", e.target.value)}
                placeholder="0"
              />
            </div>
          )}

          <div className="flex-1 space-y-2">
            <Label className="text-sm">Preço por unidade</Label>
            <Input
              value={tier.pricePerUnit}
              onChange={(e) =>
                onUpdate(tier.id, "pricePerUnit", e.target.value)
              }
              placeholder="R$ 0,00"
            />
          </div>

          {!tier.isLast && tiers.length > 2 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRemove(tier.id)}
              className="mb-0"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      <Button variant="outline" onClick={onAdd} className="w-full" type="button">
        <Plus className="h-4 w-4 mr-2" />
        Adicionar faixa de quantidade
      </Button>
    </div>
  );
}
