"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useCreateProfileForm } from "./use-create.profile.form";

export function CreateProfileForm() {
  const { handleSubmit, register, reset, errors } =
    useCreateProfileForm();

  return (
    <form
      action={() => handleSubmit()}
      className="bg-white w-full px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10"
    >
      <div className="border-b border-gray-900/10 pb-6">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nome
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  Perfil:
                </span>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  autoComplete="name"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Desenvolvimento"
                />
              </div>
              {errors.name?.message ? (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={(event) => {
              event.preventDefault();
              reset();
            }}
            type="button"
          >
            Cancelar
          </Button>
          <Button type="submit" variant="default">
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
