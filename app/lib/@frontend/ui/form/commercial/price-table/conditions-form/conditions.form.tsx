"use client";

import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Button, Checkbox, Combobox, Input } from "../../../../component";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useConditionsForm } from "./use-conditions.form";
import { BrazilianUF } from "../create/use-price-table.form";
import type { CreatePriceTableFormData } from "../create/use-price-table.form";
import { formatMoneyMask } from "@/app/lib/util";

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
                <div className="space-y-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Limite de faturamento
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="text"
                      value={field.value ? formatMoneyMask(field.value) : ""}
                      onChange={(e) => {
                        const maskedValue = formatMoneyMask(e.target.value);
                        field.onChange(maskedValue);
                      }}
                      placeholder="1.234,56"
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {error?.message && (
                    <p className="text-sm text-red-600">{error.message}</p>
                  )}
                </div>
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
