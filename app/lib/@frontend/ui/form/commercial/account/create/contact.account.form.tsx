"use client";

import { Controller } from "react-hook-form";
import { Button, Checkbox, Combobox, Input } from "../../../../component";

export function ContactAccountForm() {
  return (
    <div>
      <div className="flex flex-col items-start  gap-4">
        <Controller
          name=""
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label="Contrato"
            />
          )}
        />

        <Input label={"Nome"} />

        <Input label={"Cargo/Relação"} />

        <Input label={"Área"} />

        {false && (
          <>
            <Input label={"CPF"} />
            <Input label={"RG"} />
          </>
        )}

        <div className="flex gap-4 items-center justify-between w-full">
          <Controller
            name=""
            render={({ field }) => (
              <Combobox
                data={[]}
                label="Tipo"
                keyExtractor={(item) => item}
                displayValueGetter={(item) => item}
              />
            )}
          />

          <Input label="Contato" />
        </div>

        <h2>Contato para </h2>
        <div className="flex gap-4">
          <Controller
            name=""
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                label="Comercial"
              />
            )}
          />
          <Controller
            name=""
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                label="Suporte"
              />
            )}
          />
          <Controller
            name=""
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                label="Faturamento"
              />
            )}
          />
          <Controller
            name=""
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                label="Marketing"
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-4 w-full">
          <Button type="button" variant={"ghost"} onClick={() => {}}>
            Cancelar
          </Button>

          <Button type="button" onClick={() => {}}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
