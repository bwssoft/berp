"use client";

import { Controller, type Control } from "react-hook-form";
import { Button, Checkbox, Combobox, Input } from "../../../../component";
import { TrashIcon } from "@heroicons/react/24/outline";
import { BrazilianUF } from "@/app/lib/@backend/domain";

type Option = { id: string; text: string };

type Condition = {
  id: string;
  salesFor: BrazilianUF[];
  billingLimit?: string;
  toBillFor?: string;
};

type Group = {
  id: string;
  priority?: boolean;
  conditions: Condition[];
};

interface Props {
  groups: Group[];
  control: Control<any>;
  ufList: Option[];
  billToOptions: Option[];
  addCondition: (groupId: string) => void;
  removeCondition: (groupId: string, conditionId: string) => void;
  setGroupPriority: (groupId: string, enabled: boolean) => void;
}

export function BillingConditionsSection({
  groups,
  control,
  ufList,
  billToOptions,
  addCondition,
  removeCondition,
  setGroupPriority,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Configurações de Faturamento</h3>

      {groups.map((group, gi) => (
        <div key={group.id} className="space-y-2 rounded-lg border p-3">
          {group.conditions.map((cond, ci) => (
            <div key={cond.id} className="flex gap-2 items-end">
              {/* Vendas para (multi) */}
              <Controller
                control={control}
                name={`groups.${gi}.conditions.${ci}.salesFor`}
                render={({ field }) => (
                  <Combobox
                    label="Vendas para"
                    placeholder="Selecione"
                    data={ufList}
                    value={ufList.filter((uf) =>
                      (field.value ?? []).includes(uf.id as BrazilianUF)
                    )}
                    onChange={(v: Option[]) =>
                      field.onChange(v.map((it) => it.id as BrazilianUF))
                    }
                    keyExtractor={(e) => e.id}
                    displayValueGetter={(e) => e.text}
                  />
                )}
              />

              {/* Limite de faturamento */}
              <Controller
                control={control}
                name={`groups.${gi}.conditions.${ci}.billingLimit`}
                render={({ field }) => (
                  <Input
                    label="Limite de faturamento"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />

              {/* Faturar para (single) */}
              <Controller
                control={control}
                name={`groups.${gi}.conditions.${ci}.toBillFor`}
                render={({ field }) => (
                  <Combobox
                    label="Faturar para"
                    placeholder="Selecione"
                    data={billToOptions}
                    value={
                      field.value
                        ? [
                            {
                              id: field.value,
                              text:
                                billToOptions.find((o) => o.id === field.value)
                                  ?.text ?? field.value,
                            },
                          ]
                        : []
                    }
                    onChange={(v: Option[]) => field.onChange(v[0]?.id ?? "")}
                    keyExtractor={(o) => o.id}
                    displayValueGetter={(o) => o.text}
                  />
                )}
              />

              <Button
                variant="outline"
                type="button"
                onClick={() => removeCondition(group.id, cond.id)}
                title="Remover condição"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 items-center mt-2">
            <Button
              className="bg-purple-600 w-fit"
              type="button"
              onClick={() => addCondition(group.id)}
            >
              Nova condição
            </Button>

            <Controller
              control={control}
              name={`groups.${gi}.priority`}
              render={({ field }) => (
                <Checkbox
                  checked={!!field.value}
                  onChange={() => {
                    setGroupPriority(group.id, !field.value);
                    field.onChange(!field.value);
                  }}
                  label="Habilitar prioridade"
                />
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
