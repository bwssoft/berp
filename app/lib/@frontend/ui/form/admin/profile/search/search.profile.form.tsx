"use client";

import {
  Button,
  Input,
  Modal,
  Combobox,
} from "../../../../component";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Controller } from "react-hook-form";
import { useSearchProfileForm } from "./use-search.profile.form";

export function SearchProfileForm() {
  const {
    register,
    profiles,
    isModalOpen,
    toggleModal,
    onSubmit,
    onReset,
    errors,
    control,
    setValue,
    handleChangeProfileName,
  } = useSearchProfileForm();

  return (
    <div className="w-full space-y-2">
      {/* pesquisa rápida */}
      <div className="border border-gray-900/10 p-4 rounded-lg shadow-md bg-white">
        <div className="flex gap-2 items-end">
          <Input
            label="Perfil"
            placeholder="Digite e busque pelo nome do perfil"
            containerClassname="sm:w-96"
            onChange={handleChangeProfileName}
          />
          <Button
            type="button"
            variant="outline"
            className="rounded-full w-fit px-2 py-1 ring-gray-300"
            title="Abrir modal com filtro detalhado"
            onClick={toggleModal}
          >
            <FunnelIcon className="size-5" />
          </Button>
        </div>
      </div>
      <Modal
        position="left"
        title="Pesquisa Detalhada de Perfil"
        open={isModalOpen}
        onClose={toggleModal}
      >
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <Combobox
              label="Perfil"
              type="multiple"
              defaultValue={[]}
              data={[...profiles]}
              error={errors.profile_id?.message}
              onOptionChange={(items) =>
                setValue(
                  "profile_id",
                  items.map((i) => i.id)
                )
              }
              keyExtractor={(item) => item.id}
              displayValueGetter={(item) => item.name}
            />
            <Controller
              name="active"
              control={control}
              render={({ field, fieldState }) => (
                <Combobox
                  label="Status"
                  type="multiple"
                  data={[
                    { id: "", name: "Todos", value: false },
                    { id: "ativo", name: "Ativo", value: true },
                    { id: "inativo", name: "Inativo", value: false },
                  ]}
                  value={field.value ?? []}
                  defaultValue={[]}
                  onOptionChange={(items) =>
                    field.onChange(
                      items.some((i) => i.id === "")
                        ? [
                            { id: "ativo", name: "Ativo", value: true },
                            { id: "inativo", name: "Inativo", value: false },
                          ]
                        : items
                    )
                  }
                  error={fieldState.error?.message}
                  keyExtractor={(item) => item.id}
                  className="w-full z-50"
                  displayValueGetter={(item) => item.name}
                />
              )}
            />

            <Input
              label="Usuário"
              {...register("username")}
              error={errors.username?.message}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
           
            <Button variant="ghost" type="button" onClick={() =>{
              onReset();
              toggleModal();
            }}>
              Limpar
            </Button>
            <Button type="submit">Pesquisar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
