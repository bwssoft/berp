import { useFieldArray, useFormContext } from "react-hook-form";
import { BrazilianUF, CreatePriceTableFormData } from "../create/use-price-table.form";

export function useConditionsForm(gi?: number) {
    const { control } = useFormContext<CreatePriceTableFormData>();

    const {
        fields: groupFields,
        append: appendGroup,
        remove: removeGroup,
    } = useFieldArray({
        control,
        name: "groups",
    });

    const uid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    const createEmptyCondition = () => ({
        id: uid(),
        salesFor: [] as BrazilianUF[],
        billingLimit: "",
        toBillFor: "",
        });

    const {
        fields: condFields,
        append: appendCond,
        remove: removeCond,
    } = useFieldArray({
        control,
        name: gi !== undefined ? (`groups.${gi}.conditions` as const) : ("groups.0.conditions" as const),
    });


    return {
        groupFields,
        appendGroup,
        removeGroup,
        createEmptyCondition,
        uid,
        condFields,
        appendCond,
        removeCond,
        control
    };
}