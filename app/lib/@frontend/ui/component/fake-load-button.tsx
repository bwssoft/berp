"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

interface Props extends ButtonProps {
    isLoading?: boolean;
    controlledLoading?: boolean; // Se for true, ignora o loading interno
}

export function FakeLoadingButton({
    isLoading,
    controlledLoading = true,
    disabled,
    children,
    onClick,
    ...props
}: Props) {
    const [localLoading, setLocalLoading] = useState(false);

    async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (!controlledLoading) {
            setLocalLoading(true);
        }

        await onClick?.(e);

        if (!controlledLoading) {
            setTimeout(() => setLocalLoading(false), 10000);
        }
    }

    const finalLoading = controlledLoading ? isLoading : localLoading;

    return (
        <Button
            {...props}
            onClick={handleClick}
            disabled={finalLoading || disabled}
        >
            {finalLoading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
}
