"use client";

import { useState } from "react";
import {
    Controller,
    FieldPath,
    FieldValues,
    useFormContext,
    FieldError,
} from "react-hook-form";
import { ZodSchema } from "zod";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Input } from "./input";
import { Button } from "./button";

function getNestedError(
    errors: Record<string, unknown>,
    path: string
): FieldError | undefined {
    return path.split(".").reduce((acc: any, key) => acc?.[key], errors) as
        | FieldError
        | undefined;
}

type ValidateFieldProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    zodSchema?: ZodSchema;
    onValidate?: (value: unknown) => Promise<void>;
    onAdd?: () => void;
    children?: React.ReactNode;
};

export function ValidateField<T extends FieldValues>({
    name,
    label,
    placeholder,
    zodSchema,
    onValidate,
    onAdd,
    children,
}: ValidateFieldProps<T>) {
    const {
        control,
        formState: { errors },
        setError,
        clearErrors,
    } = useFormContext<T>();

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = async (value: unknown) => {
        if (zodSchema) {
            const parsed = zodSchema.safeParse(value);
            if (!parsed.success) {
                setError(name, { message: parsed.error.errors[0].message });
                return;
            }
        }
        if (onValidate) {
            try {
                setLoading(true);
                await onValidate(value);
            } catch (e: any) {
                setError(name, { message: e.message || "Erro ao validar" });
                return;
            } finally {
                setLoading(false);
            }
        }
        clearErrors(name);
        setValidated(true);
    };

    const error = getNestedError(errors as any, name as string)?.message;

    return (
        <div className="flex gap-1 ">
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Input
                        {...field}
                        label={label}
                        placeholder={placeholder}
                        error={error as string | undefined}
                        className="w-full"
                    />
                )}
            />

            {children}

            <div className="mt-1 flex items-end">
                {!validated ? (
                    <Button
                        variant={"default"}
                        type="button"
                        title="Validar"
                        disabled={loading}
                        onClick={() =>
                            validate((control._formValues as any)[name])
                        }
                    >
                        Validar
                    </Button>
                ) : (
                    <Button
                        variant={"default"}
                        type="button"
                        title="Editar"
                        onClick={() => setValidated(false)}
                    >
                        Editar
                    </Button>
                )}

                {onAdd && (
                    <Button
                        type="button"
                        title="Adicionar"
                        variant="ghost"
                        onClick={onAdd}
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <PlusIcon className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
