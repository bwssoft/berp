"use client";

import { useState } from "react";

export function useAddressUpdateModal() {
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
