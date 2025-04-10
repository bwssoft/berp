import { cn } from "@/app/lib/util";
import React from "react";
import { useCombobox } from "./index";

interface ComboboxViewToggleProps extends React.ComponentProps<"div"> {}

export const ComboboxViewToggle = React.forwardRef<
  HTMLDivElement,
  ComboboxViewToggleProps
>(({ className, ...rest }, ref) => {
  const { selectedOptions, optionsSource, setOptionsSource, type } =
    useCombobox();

  function handleButtonClick() {
    setOptionsSource((mode) => {
      if (mode === "all" || mode === "searched") {
        return "selected";
      }

      return "all";
    });
  }

  if (type !== "multiple" || selectedOptions.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("mt-1 border-t border-border p-1", className)}
      {...rest}
    >
      <button
        className="h-9 w-full rounded-md bg-background text-sm shadow-sm transition-colors hover:bg-accent active:cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:hover:bg-muted"
        onClick={handleButtonClick}
      >
        Mostrar {optionsSource === "all" ? "apenas os selecionados" : "todos"}
      </button>
    </div>
  );
});

ComboboxViewToggle.displayName = "ComboboxViewToggle";
