/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useClientCreateForm } from "./use-client-create-form";
import { ContactDepartmentEnum, ContactRoleEnum } from "@/app/lib/@backend/domain";
import { clientConstants } from "@/app/lib/constant";

export function ClientCreateForm() {
  const {
    register,
    contacts,
    handleAppendContact,
    handleRemoveContact,
    handleSubmit,
  } = useClientCreateForm();
  return (
    <form action={() => handleSubmit()} className="mt-10">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Informações da empresa
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha com os dados referente a empresa.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="document"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Documento
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="document"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("document.value")}
                />
              </div>
            </div>            
            <div className="sm:col-span-3">
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Razão Social
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="company_name"
                  autoComplete="company_name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("company_name")}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="company_name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome Fantasia
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="trade_name"
                  autoComplete="trade_name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("trade_name")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Setor
              </label>
              <select
                id="sector"
                {...register("sector")}
                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Selecione um setor</option>
                {Object.entries(clientConstants.sector).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  {...register("description")}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre o cliente.
              </p>
            </div>


            <div className="sm:col-span-2">
              <label
                htmlFor="state_registration"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Inscrição Estadual
              </label>
              <div className="mt-2">
                <input
                  id="state_registration"
                  type="text"
                  autoComplete="state_registration"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("tax_details.state_registration")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="municipal_registration"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Inscrição Municipal
              </label>
              <div className="mt-2">
                <input
                  id="municipal_registration"
                  type="text"
                  autoComplete="municipal_registration"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("tax_details.municipal_registration")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Regime tributário
              </label>
              <select
                id="tax_details.regime"
                className="block w-full rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Selecione um regime tributário</option>
                {Object.entries(clientConstants.taxRegime).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>


            <div className="sm:col-span-2">
              <label
                htmlFor="postal_code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Código Postal
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="postal_code"
                  autoComplete="postal_code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.postal_code")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                País
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="country"
                  autoComplete="country"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.country")}
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="street"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rua
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="street"
                  autoComplete="street"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.street")}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="district"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bairro
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="district"
                  autoComplete="district"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.district")}
                />
              </div>
            </div>
            <div className="sm:col-span-3 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cidade
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.city")}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Estado
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="state"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("address.state")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Contatos
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Registre as pessoas responsáveis pelo contato com empresa.
          </p>

          <div className="mt-10">
            <div className="col-span-full">
              {contacts.map((item, index) => (
                <div key={item.id} className="flex space-x-4 mt-5">
                  <input
                    type="text"
                    id="contact-name"
                    autoComplete="contact-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Nome"
                    {...register(`contacts.${index}.name`)}
                  />
                  <input
                    type="tel"
                    id="contact-phone"
                    autoComplete="contact-phone"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Telefone"
                    {...register(`contacts.${index}.phone`)}
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveContact(index)}
                    className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                  >
                    <XMarkIcon width={16} height={16} />
                  </Button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                handleAppendContact({
                  name: "",
                  phone: "",
                  id: crypto.randomUUID(),
                  can_sign_contract: false,
                  created_at: new Date(),
                  email: "",
                  role: ContactRoleEnum["other"],
                  department: ContactDepartmentEnum["other"],
                  can_receive_document: false,
                })
              }
              className="mt-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
            >
              Adicionar Contato
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
