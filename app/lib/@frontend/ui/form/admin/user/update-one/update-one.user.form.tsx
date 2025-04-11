"use client";

import { Button, Checkbox, Input } from "../../../../component";
import { Combobox } from "@bwsoft/combobox";
import { Controller } from "react-hook-form";
import { IUser } from "@/app/lib/@backend/domain";
import { useUpdateOneUserForm } from "./use-update-one-user-form";
import {
    ActiveUserDialog,
    LockUserDialog,
    ResetPasswordUserDialog,
    useActiveUserDialog,
    useLockUserDialog,
    useResetPasswordUserDialog,
} from "../../../../dialog";

interface Props {
    user: IUser;
}

export function UpdateOneUserForm({ user }: Props) {
    const {
        register,
        control,
        errors,
        profiles,
        userData,
        handleSubmit,
        handleCancelEdit,
        handleBackPage,
    } = useUpdateOneUserForm(user);

    const lockDialog = useLockUserDialog({
        userId: userData.id,
        willLock: !userData.lock,
    });

    const activeDialog = useActiveUserDialog({
        userId: userData.id,
        willActivate: !userData.active,
    });

    const resetPasswordDialog = useResetPasswordUserDialog({
        userId: userData.id,
    });

    const isLocked = userData.lock;
    const isActive = userData.active;

    return (
        <>
            <form
                action={() => handleSubmit()}
                className="bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset w-full ring-gray-900/10"
            >
                <div className="border-b border-gray-900/10 pb-6">
                    <div className="mt-10 flex gap-2 justify-end">
                        <Button
                            variant="secondary"
                            onClick={lockDialog.openDialog}
                            type="button"
                        >
                            {isLocked
                                ? "Desbloquear Usuário"
                                : "Bloquear Usuário"}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={resetPasswordDialog.openDialog}
                            disabled={isLocked}
                            type="button"
                        >
                            Reset de Senha
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={activeDialog.openDialog}
                            type="button"
                        >
                            {isActive ? "Inativar" : "Ativar"}
                        </Button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Controller
                                control={control}
                                name="external"
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        defaultChecked={field.value}
                                        label="Usuário Externo"
                                        disabled={isLocked}
                                    />
                                )}
                            />
                        </div>

                        <Input
                            label="CPF"
                            {...register("cpf")}
                            error={errors.cpf?.message}
                            disabled={isLocked}
                        />

                        <Input
                            label="Nome Completo"
                            {...register("name")}
                            error={errors.name?.message}
                            disabled={isLocked}
                        />

                        <Input
                            label="Email"
                            type="email"
                            {...register("email")}
                            error={errors.email?.message}
                            disabled={isLocked}
                        />

                        <Input
                            label="Usuário"
                            {...register("username")}
                            error={errors.username?.message}
                            disabled={isLocked}
                        />

                        <Controller
                            control={control}
                            name="profile"
                            render={({ field }) => (
                                <Combobox
                                    label="Perfis"
                                    className="mt-2"
                                    type="multiple"
                                    data={profiles ?? []}
                                    error={errors.profile?.message}
                                    value={field.value || []}
                                    onOptionChange={(items) => {
                                        field.onChange(items);
                                    }}
                                    keyExtractor={(item) => item.id}
                                    displayValueGetter={(item) => item.name}
                                    disabled={isLocked}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-2  mt-6 justify-end">
                  
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleBackPage}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="default">Salvar</Button>
                    </div>
                </div>
            </form>

            <LockUserDialog
                open={lockDialog.open}
                setOpen={lockDialog.setOpen}
                confirm={lockDialog.confirm}
                isLoading={lockDialog.isLoading}
                willLock={!isLocked}
            />

            <ActiveUserDialog
                open={activeDialog.open}
                setOpen={activeDialog.setOpen}
                confirm={activeDialog.confirm}
                isLoading={activeDialog.isLoading}
                willActivate={!isActive}
            />

            <ResetPasswordUserDialog
                open={resetPasswordDialog.open}
                setOpen={resetPasswordDialog.setOpen}
                confirm={resetPasswordDialog.confirm}
                isLoading={resetPasswordDialog.isLoading}
            />
        </>
    );
}
