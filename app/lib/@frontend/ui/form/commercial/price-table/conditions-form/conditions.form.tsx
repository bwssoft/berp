"use client";

import { Controller } from "react-hook-form";
import { Button, Checkbox, Combobox, Input } from "../../../../component";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useConditionsForm } from "./use-conditions.form";
import { BrazilianUF } from "../create/use-price-table.form";

type Props = {
  ufList: { id: string; text: string }[];
  billToOptions: { id: string; text: string }[];
  onValidate?: () => void;
};

export function BillingConditionsSection({
  ufList,
  billToOptions,
  onValidate,
}: Props) {
  const { appendGroup, groupFields, createEmptyCondition, uid } =
    useConditionsForm();

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Configurações de Faturamento</h3>

      {groupFields.map((g, gi) => (
        <GroupFields
          key={g.rhfId}
          gi={gi}
          ufList={ufList}
          billToOptions={billToOptions}
        />
      ))}
      <div className="flex gap-4">
        <Button
          type="button"
          className="bg-blue-600"
          onClick={() =>
            appendGroup({
              id: uid(),
              priority: false,
              conditions: [createEmptyCondition()],
            })
          }
        >
          Novo grupo de condições
        </Button>

        {onValidate && (
          <Button type="button" className="bg-green-600" onClick={onValidate}>
            Validar condições
          </Button>
        )}
      </div>
    </div>
  );
}

function GroupFields({
  gi,
  ufList,
  billToOptions,
}: {
  gi: number;
  ufList: { id: string; text: string }[];
  billToOptions: { id: string; text: string }[];
}) {
  const {
    groupFields,
    removeGroup,
    condFields,
    appendCond,
    removeCond,
    control,
    createEmptyCondition,
    getUfOptionsFor,
    isUfDisabled,
  } = useConditionsForm(gi);

  const groupsCount = groupFields.length;

  return (
    <div className="space-y-2 rounded-lg border p-3">
      {condFields.map((c, ci) => (
        <div key={c.rhfId} className="grid grid-cols-4 gap-2 items-start">
          {/* Vendas para (multi) */}
          <Controller
            control={control}
            name={`groups.${gi}.conditions.${ci}.salesFor`}
            render={({ field, fieldState: { error } }) => {
              const options = getUfOptionsFor(ufList, field.value);
              return (
                <div className="w-full">
                  <Combobox
                    label="Vendas para"
                    placeholder="Selecione"
                    data={options}
                    // itemPropsGetter={(opt) => ({
                    //   disabled: isUfDisabled(opt.id, field.value),
                    // })}
                    value={options.filter((uf) =>
                      (field.value ?? []).includes(uf.id as BrazilianUF)
                    )}
                    onChange={(v: { id: string; text: string }[]) =>
                      field.onChange(v.map((it) => it.id as BrazilianUF))
                    }
                    keyExtractor={(e) => e.id}
                    displayValueGetter={(e) => e.text}
                    error={error?.message}
                  />
                </div>
              );
            }}
          />

          {/* Limite de faturamento */}
          <Controller
            control={control}
            name={`groups.${gi}.conditions.${ci}.billingLimit`}
            render={({ field, fieldState: { error } }) => (
              <div className="w-full">
                <Input
                  label="Limite de faturamento"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Ex: 1.234,56"
                  error={error?.message}
                />
              </div>
            )}
          />

          {/* Faturar para (single) */}
          <Controller
            control={control}
            name={`groups.${gi}.conditions.${ci}.toBillFor`}
            render={({ field, fieldState: { error } }) => (
              <div className="w-full">
                <Combobox
                  label="Faturar para *"
                  placeholder="Selecione"
                  data={billToOptions}
                  withTooltip
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
                  onChange={(v: { id: string; text: string }[]) =>
                    field.onChange(v[0]?.id ?? "")
                  }
                  keyExtractor={(o) => o.id}
                  displayValueGetter={(o) => o.text}
                  error={error?.message}
                />
              </div>
            )}
          />

          {/* Lixeira (remover condição/grupo com fallback) */}
          <div className="flex items-start pt-7">
            <Button
              variant="outline"
              type="button"
              title="Remover condição"
              className="h-10"
              onClick={() => {
                if (condFields.length > 1) {
                  // remove só a condição
                  removeCond(ci);
                  return;
                }

                // é a única condição do grupo
                if (groupsCount > 1) {
                  // existem outros grupos → remove o grupo inteiro
                  removeGroup(gi);
                  return;
                }

                // único grupo e única condição → reseta a linha
                removeCond(0);
                appendCond(createEmptyCondition());
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex gap-2 items-center mt-2">
        <Button
          className="bg-purple-600 w-fit"
          type="button"
          onClick={() => appendCond(createEmptyCondition())}
        >
          Nova condição
        </Button>

        <Controller
          control={control}
          name={`groups.${gi}.priority`}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={() => field.onChange(!field.value)}
              label="Habilitar prioridade"
            />
          )}
        />
      </div>
    </div>
  );
}
