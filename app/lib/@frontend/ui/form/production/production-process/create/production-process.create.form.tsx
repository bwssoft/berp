"use client";
import { Button } from "@/app/lib/@frontend/ui/button";
import { CheckboxEditable } from "@/app/lib/@frontend/ui/checkbox-editable";
import { useProductionProcessCreateForm } from "./use-production-process-create-form";

export function ProductionProcessCreateForm() {
  const {
    register,
    handleSubmit,
    handleAppendStep,
    handleRemoveStep,
    handleStepLabelEdit,
    steps,
  } = useProductionProcessCreateForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    Processo:
                  </span>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="E3+"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <p className="block text-sm font-medium leading-6 text-gray-900">
                Etapas do processo
              </p>
              <div className="mt-2">
                {steps.map((step, stepIndex) => (
                  <CheckboxEditable
                    key={step.id}
                    label={step.label}
                    onDelete={() => handleRemoveStep(stepIndex)}
                    onLabelEdit={(newLabel) =>
                      handleStepLabelEdit({
                        label: newLabel,
                        stepIndex: stepIndex,
                      })
                    }
                    viewOnly={false}
                  />
                ))}

                <Button
                  type="button"
                  onClick={() => handleAppendStep()}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Adicionar etapa
                </Button>
              </div>
            </div>
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
