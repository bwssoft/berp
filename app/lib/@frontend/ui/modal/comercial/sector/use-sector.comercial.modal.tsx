"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import {
    createOneSector,
    findManySector,
} from "@/app/lib/@backend/action/commercial/sector.action";

const SectorSchema = z.object({ name: z.string().trim().min(1) });
type SectorForm = z.infer<typeof SectorSchema>;

export function useSectorModal() {
    const [open, setOpen] = useState(false);
    const [sectors, setSectors] = useState<ISector[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SectorForm>({
        resolver: zodResolver(SectorSchema),
        defaultValues: { name: "" },
    });

    const fetchSectors = async () => {
        setIsLoading(true);
        const data = await findManySector({});
        setSectors(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSectors();
    }, []);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const addSector = async ({ name }: SectorForm) => {
        const sector = await createOneSector({ name, active: true });
        await fetchSectors();
        reset();
        closeModal;
    };

    return {
        open,
        openModal,
        closeModal,
        sectors,
        isLoading,
        register,
        errors,
        handleAdd: handleSubmit(addSector),
        isPending: isSubmitting,
    };
}
