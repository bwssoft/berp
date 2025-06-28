"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useCreateProfileForm } from "./use-create.profile.form";
import { Input } from "../../../../component";

export function CreateProfileForm() {
    const { handleSubmit, register, handleCancelCreate, errors } =
        useCreateProfileForm();

    return (
        <form
            action={() => handleSubmit()}
            className="bg-white w-full px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10"
        >
            <div className="border-b border-gray-900/10 pb-6">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <Input
                        {...register("name")}
                        type="text"
                        id="name"
                        label="Nome"
                        autoComplete="name"
                        placeholder="Digite o nome do perfil"
                        className="w-full md:w-[29vw]"
                        error={errors.name?.message}
                    />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleCancelCreate}
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
