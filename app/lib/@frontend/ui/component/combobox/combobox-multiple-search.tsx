import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/util";
import React, { ComponentProps } from "react";
import { useCombobox } from ".";
import { useDebounce } from "../../../hook/use-debounce";

interface ComboboxMultipleSearchProps extends ComponentProps<"input"> {}

export const ComboboxMultipleSearch = React.forwardRef<
  HTMLInputElement,
  ComboboxMultipleSearchProps
>(({ className, ...props }, ref) => {
  const {
    setQuery,
    optionsSource,
    setOptionsSource,
    selectedOptions,
    onSearchChange,
    type,
    useSearchChangeDebounce,
    searchChangeDebounceDelay,
  } = useCombobox();

  const handleInputChangeDebounce = useDebounce(
    handleInputChange,
    searchChangeDebounceDelay || 500
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (optionsSource === "all") {
      setOptionsSource("searched");
    }

    if (optionsSource !== "selected" && onSearchChange) {
      onSearchChange(event.target.value, selectedOptions);
    }

    setQuery(event.target.value);
  }

  if (type !== "multiple") {
    return null;
  }

  return (
    <div className="group flex items-center border-b border-b-border px-3">
      <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        autoFocus
        ref={ref}
        placeholder="Pesquisar item..."
        onChange={(event) => {
          if (useSearchChangeDebounce) {
            handleInputChangeDebounce(event);
          } else {
            handleInputChange(event);
          }
        }}
        className={cn(
          "flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
});

ComboboxMultipleSearch.displayName = "ComboboxMultipleSearch";
