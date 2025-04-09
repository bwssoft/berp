import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { cn } from "@/app/lib/util";
import React from "react";
import { useCombobox } from ".";

interface ComboboxLoadingProps extends React.ComponentProps<"div"> {}

export const ComboboxLoading = React.forwardRef<
  HTMLDivElement,
  ComboboxLoadingProps
>(({ className, ...rest }, ref) => {
  const { isLoading, options, selectedOptions, type } = useCombobox();

  if (!isLoading || (options?.length !== 0 && selectedOptions?.length !== 0)) {
    return null;
  }

  if (type !== "multiple" && options.length !== 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-32 flex-col items-center justify-center gap-2 p-2 text-gray-500",
        className
      )}
      {...rest}
    >
      <ArrowPathIcon className="h-4 w-4 animate-spin" />
      <span className="text-sm">Buscando opções disponíveis</span>
    </div>
  );
});

ComboboxLoading.displayName = "ComboboxLoading";
