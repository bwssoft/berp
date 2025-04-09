import { cn } from "@/app/lib/util";
import React from "react";
import { useCombobox } from ".";

interface ComboboxEmptyProps extends React.ComponentProps<"div"> {}

export const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  ComboboxEmptyProps
>(({ className, ...rest }, ref) => {
  const { options, behavior, isLoading } = useCombobox();

  if ((options && options.length !== 0) || isLoading) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-28 items-center justify-center p-2",
        behavior === "search" && "h-32 flex-col",
        className
      )}
      {...rest}
    >
      {behavior === "search" ? (
        <span className="px-4 text-center text-sm text-gray-500">
          Nenhuma sugestão encontrada. Utilizaremos o texto inserido no campo.
        </span>
      ) : (
        <span className="text-sm text-gray-500">Nenhum item encontrado</span>
      )}
    </div>
  );
});

ComboboxEmpty.displayName = "ComboboxEmpty";
