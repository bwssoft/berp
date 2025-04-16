"use client";

import { Button, Input, Modal, Combobox } from "../../../../component";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Controller } from "react-hook-form";
import { useSearchProfileForm } from "./use-search.profile.form";

export function SearchProfileForm() {
  const {
    register,
    users,
    profiles,
    isModalOpen,
    toggleModal,
    onSubmit,
    onReset,
    errors,
    control,
    setValue,
    handleChangeProfileName,
    handleSearchProflile,
    handleSearchUser,
  } = useSearchProfileForm();

  return (
    <div className="w-full space-y-2">
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
            <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <Combobox
                  label="Perfil"
                  type="multiple"
                  data={[...profiles]}
                  defaultValue={field.value}
                  error={errors.profile?.message}
                  onSearchChange={handleSearchProflile}
                  keyExtractor={(item) => item.id}
                  displayValueGetter={(item) => item.name}
                  placeholder="Digite e busque pelo nome do perfil"
                  onOptionChange={(items) =>
                    setValue(
                      "profile",
                      items.map((i) => ({ id: i.id, name: i.name }))
                    )
                  }
                />
              )}
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
                  placeholder="Selecione o status"
                  displayValueGetter={(item) => item.name}
                />
              )}
            />

            <Controller
              name="user"
              control={control}
              render={({field}) => (
                <Combobox
                  label="Usuários"
                  type="multiple"
                  data={[...users]}
                  error={errors.user?.message}
                  onSearchChange={handleSearchUser}
                  defaultValue={field.value}
                  keyExtractor={(item) => item.id}
                  displayValueGetter={(item) => item.name}
                  placeholder="Digite e busque pelo nome do usuário"
                  onOptionChange={(items) =>
                    setValue(
                      "user",
                      items.map((i) => ({ id: i.id, name: i.name, profile: i.profile }))
                    )
                  }
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={onReset}
            >
              Limpar
            </Button>
            <Button type="submit">Pesquisar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
