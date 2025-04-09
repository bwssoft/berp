import {
  ArrowPathIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useDebounce } from "@/app/lib/@frontend/hook";
import { cn } from "@/app/lib/util";
import React from "react";

import { useCombobox } from "./index";

interface ComboboxSingleTriggerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ComboboxSingleTriggerImpl = ({
  className,
  ...rest
}: ComboboxSingleTriggerProps) => {
  const {
    isLoading,
    isOptionsOpened,
    selectedOptions,
    setSelectedOptions,
    setIsOptionsOpened,
    behavior,
    query,
    setQuery,
    optionsSource,
    setOptionsSource,
    onReset,
    placeholder,
    onSearchChange,
    disabled,
    useSearchChangeDebounce,
    searchChangeDebounceDelay,
    error,
  } = useCombobox();

  const hasSelectedItem = React.useMemo(() => {
    if (selectedOptions.length === 1) {
      return true;
    }

    return false;
  }, [selectedOptions]);

  const handleInputFocus = () => {
    if (!isOptionsOpened) {
      setIsOptionsOpened(true);

      if (behavior === "search" && optionsSource !== "all") {
        setOptionsSource("all");
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (behavior === "select" && selectedOptions) {
      setSelectedOptions?.([]);
    }

    if (optionsSource === "all") {
      setOptionsSource("searched");
    }

    onSearchChange?.(event.target.value, selectedOptions);
  };

  const handleToggleClick = () => {
    setIsOptionsOpened((opened) => !opened);
  };

  const handleInputChangeDebounce = useDebounce(
    handleInputChange,
    searchChangeDebounceDelay || 500
  );

  return (
    <div className={cn("group flex w-full items-center gap-2 rounded-md")}>
      <div
        className={cn(
          "flex h-9 w-full items-center rounded-md bg-white ring-1 ring-gray-300 group-focus-within:ring-2 group-focus-within:ring-blue-600 hover:ring-blue-600",
          error && "border-red-500 ring-red-500"
        )}
      >
        <input
          {...rest}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={handleInputFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            if (useSearchChangeDebounce) {
              handleInputChangeDebounce(event);
            } else {
              handleInputChange(event);
            }
          }}
          className={cn(
            "h-full w-full rounded-md rounded-r-none border-0 border-r-0 border-gray-300 bg-white px-2 text-sm text-gray-900 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
            disabled && "text-muted-foreground",
            className
          )}
        />

        {hasSelectedItem && behavior !== "search" && (
          <button
            type="button"
            onClick={onReset}
            className="group-focus:ring-ring/20 h-full px-3 text-gray-900 duration-200 animate-in slide-in-from-right-3 group-focus:ring-2 hover:bg-blue-600 focus-visible:border-blue-600/70"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="h-4 w-[1px] bg-border" />

        <button
          type="button"
          disabled={disabled}
          onClick={handleToggleClick}
          className="h-full rounded-l-none rounded-r-md border-border px-3 text-gray-900 transition-colors hover:bg-blue-600"
        >
          {isLoading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOptionsOpened ? "rotate-180" : "rotate-0"
              )}
            />
          )}
        </button>
      </div>
    </div>
  );
};
