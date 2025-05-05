"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { Controller } from "react-hook-form";
import { Button, Combobox, Input, Modal } from "../../../../component";
import { useSearchUserForm } from "./use-search.user.form";

export function SearchUserForm() {
  const {
    register,
    isModalOpen,
    toggleModal,
    profiles,
    onSubmit,
    onReset,
    setValue,
    control,
    errors,
    handleChangeProfileName,
    handleSearchProflile
  } = useSearchUserForm();

  return (
      <div className="w-full space-y-2">
        <div className="border border-gray-900/10 p-4 rounded-lg shadow-md bg-white">
          <div className="flex gap-2 items-end">
            <Input
              label="Nome ou CPF"
              placeholder="Digite e busque pelo nome do usuário ou CPF"
              containerClassname="sm:w-96"
              onChange={handleChangeProfileName}
            />
            <Button
              type="button"
              variant={"outline"}
              className="rounded-full w-fit px-2 py-1 ring-gray-300"
              title="Abrir modal com filtro detalhado"
              onClick={toggleModal}
            >
              <FunnelIcon className="size-5" />
            </Button>
          </div>
        </div>

        <Modal position="left"  title="Pesquisa Detalhada" onClose={toggleModal} open={isModalOpen}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <Input
                label="Nome"
                {...register("name")}
                 placeholder="Digite o nome"
                error={errors.name?.message}
              />
              <Input
                label="CPF"
                {...register("cpf")}
                placeholder="Digite o CPF do usuário"
                error={errors.cpf?.message}
              />
              <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <Combobox
                  label="Perfil"
                  type="multiple"
                  data={[...profiles]}
                  value={field.value}
                  error={errors.profile?.message}
                  onSearchChange={handleSearchProflile}
                  keyExtractor={(item) => item.id}
                  displayValueGetter={(item) => item.name}
                  placeholder="Selecione um perfil"
                  onOptionChange={(items) =>
                    setValue(
                      "profile",
                      items.map((i) => ({ id: i.id, name: i.name }))
                    )
                  }
                />
              )}
            />
              <Input
                label="Usuário"
                {...register("username")}
                placeholder="Digite o nome de usuário"
                error={errors.username?.message}
              />
              <Input
                label="Email"
                {...register("email")}
                placeholder="Digite o email"
                error={errors.email?.message}
              />

              <Controller
                name="active"
                control={control}
                render={({ field, fieldState }) => (
                  <Combobox
                    label="Status"
                    placeholder="Selecione o status"
                    type="multiple"
                    data={[
                      { id: "", name: "Todos", value: false },
                      { id: "ativo", name: "Ativo", value: true },
                      { id: "inativo", name: "Inativo", value: false },
                    ]}
                    value={field.value}
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
                    className="w-full z-50 "
                    displayValueGetter={(item) => item.name}
                  />
                )}
              />

              <Controller
                name="external"
                control={control}
                render={({ field, fieldState }) => (
                  <Combobox
                    label="Externo/Interno"
                    type="multiple"
                    data={[
                      { id: "", name: "Todos", value: false },
                      { id: "1", name: "externo", value: true },
                      { id: "2", name: "interno", value: false },
                    ]}
                    value={field.value}
                    placeholder="Selecione o tipo de usuário"
                    defaultValue={[]}
                    onOptionChange={(items) =>
                      field.onChange(
                        items.some((i) => i.id === "")
                          ? [
                              { id: "1", name: "externo", value: true },
                              { id: "2", name: "interno", value: false },
                            ]
                          : items
                      )
                    }
                    error={fieldState.error?.message}
                    keyExtractor={(item) => item.id}
                    className="w-full z-50 "
                    displayValueGetter={(item) => item.name}
                  />
                )}
              />

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" type="button" onClick={onReset}>
                Limpar
              </Button>
              <Button type="submit">Pesquisar</Button>
            </div>
          </form>
      </Modal>
      </div>
  );
}
