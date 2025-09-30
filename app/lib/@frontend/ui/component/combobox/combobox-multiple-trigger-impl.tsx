import { ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/util";
import { motion } from "framer-motion";
import React from "react";
import { useCombobox } from ".";

interface ComboboxMultipleTriggerImplProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ComboboxMultipleTriggerImpl = <TData,>({
  className,
  ...rest
}: ComboboxMultipleTriggerImplProps) => {
  const {
    isOptionsOpened,
    setIsOptionsOpened,
    displayValueGetter,
    isLoading,
    disabled,
    selectedOptions,
    placeholder,
    onDeselect,
  } = useCombobox();

  const multipleInputRef = React.useRef<HTMLButtonElement>(null);

  function handleComboboxClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (disabled) return;
    
    if (!isOptionsOpened) {
      return setIsOptionsOpened(true);
    }

    event.stopPropagation();
  }

  function handleOptionClick(
    option: TData,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (disabled) return;
    onDeselect(option);
    event.stopPropagation();
  }

  function handleToggleClick() {
    if (disabled) return;
    setIsOptionsOpened((opened) => !opened);
  }

    const { setOptionsSource } =
      useCombobox();

  return (
    <div
      className={cn(
        "flex h-9 w-full items-center rounded-md ring-1 ring-gray-300 overflow-hidden",
        isOptionsOpened && "ring-2 ring-blue-600",
        disabled && "bg-gray-100 ring-gray-200 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        ref={multipleInputRef}
        onClick={handleComboboxClick}
        className={cn(
          "focus-visible:ring-ring/20 relative flex h-full w-full items-center gap-1 overflow-x-auto overflow-y-hidden bg-white py-1 text-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:border-blue-600/70 focus-visible:outline-none focus-visible:ring-2",
          disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
          className
        )}
        {...rest}
      >
        {selectedOptions.length === 0 && placeholder ? (
          <span className="px-3 text-gray-500">{placeholder}</span>
        ) : (
          <motion.div
            drag="x"
            className="absolute inset-0 flex items-center overflow-hidden"
            dragConstraints={multipleInputRef}
          >
            <div className="flex items-center gap-x-1.5 px-3">
              {selectedOptions.slice(0, 3).map((data, index) => (
                <div
                  key={index}
                  className="flex items-center divide-x divide-gray-300 rounded-md ring-1 ring-gray-300 animate-in slide-in-from-left-2 max-w-full"
                >
                  <div
                    className={cn(
                      "flex h-6 items-center rounded-md rounded-r-none border-r-0 bg-white px-2 text-xs font-semibold text-secondary-foreground",
                      ` truncate whitespace-nowrap ${selectedOptions.length == 2 ? "max-w-[11rem]" : "max-w-[5rem]"}`,
                      `${selectedOptions.length == 1 && "max-w-full"}`,
                      disabled && "bg-gray-100 text-gray-500 cursor-not-allowed"
                    )}
                    title={displayValueGetter(data)}
                  >
                    {displayValueGetter(data)}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => handleOptionClick(data as TData, event)}
                    disabled={disabled}
                    className={cn(
                      "flex h-6 items-center rounded-md rounded-l-none bg-white px-2 text-xs font-semibold text-secondary-foreground transition-all",
                      disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "hover:opacity-70"
                    )}
                    aria-label="Remover"
                    title="Remover"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {selectedOptions.length > 3 && (
                <div
                  className="flex items-center hover:bg-gray-300 rounded-md ring-1 ring-gray-300 bg-white px-2 h-6 text-xs font-semibold text-secondary-foreground select-none"
                  aria-hidden
                  onClick={() => setOptionsSource("selected")}
                >
                  +{selectedOptions.length - 3}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </button>

      <div className="h-4 w-[1px] bg-gray-300" />

      <button
        type="button"
        disabled={disabled}
        onClick={handleToggleClick}
        className={cn(
          "h-full rounded-l-none rounded-r-md border-gray-300 px-3 text-foreground transition-colors",
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white hover:bg-gray-200"
        )}
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
  );
};
