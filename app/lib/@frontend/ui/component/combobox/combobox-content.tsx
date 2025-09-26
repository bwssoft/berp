"use client";

import { useCombobox } from ".";
import { ComboboxItem } from "./combobox-item";

export const ComboboxContent = () => {
  const { behavior, options, optionsSource } = useCombobox();
  return (
    <div className="app-scrollbar-nested z-[500] h-full overflow-y-auto p-1">
      <ul className="space-y-0.5">
        {behavior === "search" && (
          <li className="px-2 py-1.5 text-xs text-muted-foreground">
            <span>Sugestões de auto-preenchimento</span>
            {optionsSource === "selected" && (
              <span className="text-red-500"> (Mostrando apenas os selecionados)</span>
            )}
          </li>
        )}

        {options?.map((option) => (
        
          <ComboboxItem key={option.id} option={option} />
        ))}
      </ul>
    </div>
  );
};
