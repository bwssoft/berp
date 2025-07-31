"use client";

import { useState } from "react";

export function useAccountDataUpdateModal() {
    const [open, setOpen] = useState(false);

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    return {
        open,
        openModal,
        closeModal,
    };
}
