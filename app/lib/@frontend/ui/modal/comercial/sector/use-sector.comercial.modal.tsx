"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import {
    createOneSector,
    findManySector,
    updateOneSector,
} from "@/app/lib/@backend/action/commercial/sector.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";

const SectorSchema = z.object({ name: z.string().trim().min(1) });
type SectorForm = z.infer<typeof SectorSchema>;

export function useSectorModal() {
    const [open, setOpen] = useState(false);
    const [sectors, setSectors] = useState<ISector[]>([]);
    const [enabledSectors, setEnabledSectors] = useState<ISector[]>([]);

    const [updatedSectors, setUpdatedSectors] = useState<
        Record<string, boolean>
    >({});
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
        setEnabledSectors(data.filter((sector) => sector.active));

        setIsLoading(false);
    };

    useEffect(() => {
        fetchSectors();
    }, []);

    const handleToggle = (sector: ISector) => {
        const newActive = !sector.active;

        setSectors((prev) => {
            const newSectors = prev.map((s) =>
                s.id === sector.id ? { ...s, active: newActive } : s
            );
            setEnabledSectors(newSectors.filter((s) => s.active));
            return newSectors;
        });

        setUpdatedSectors((prev) => ({
            ...prev,
            [sector.id]: newActive,
        }));
    };

    const handleSave = async () => {
        try {
            const updates = Object.entries(updatedSectors);
            for (const [id, active] of updates) {
                await updateOneSector({ id }, { active });
            }
            setUpdatedSectors({});
            toast({
                title: "Sucesso!",
                variant: "success",
            });

            await fetchSectors();

            closeModal();
        } catch (error: any) {
            toast({
                title: "Erro ao salvar.",
                description:
                    error instanceof Error
                        ? error.message
                        : "Erro desconhecido",
                variant: "error",
            });
        }
    };

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const addSector = async ({ name }: SectorForm) => {
        try {
            await createOneSector({ name, active: true });
            await fetchSectors();
            reset();
            closeModal();
        } catch (error: any) {
            toast({
                title: "Erro ao criar setor.",
                description:
                    error instanceof Error
                        ? error.message
                        : "Erro desconhecido",
                variant: "error",
            });
        }
    };

    return {
        open,
        openModal,
        closeModal,
        sectors,
        enabledSectors,
        isLoading,
        register,
        errors,
        handleAdd: handleSubmit(addSector),
        isPending: isSubmitting,
        handleToggle,
        handleSave,
        updatedSectors,
    };
}
