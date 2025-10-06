import { CheckIcon } from "@heroicons/react/20/solid";
import { cn } from "@/app/lib/util";
import React, { ComponentProps } from "react";
import { useCombobox } from ".";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

interface ComboboxItemProps<TOptionData>
  extends Omit<ComponentProps<"li">, "value"> {
  option: TOptionData;
  withTooltip?: boolean;
}

export const ComboboxItem = <TOptionData,>({
  option,
  className,
  withTooltip,
  ...rest
}: ComboboxItemProps<TOptionData>) => {
  const {
    selectedOptions,
    type,
    keyExtractor,
    displayValueGetter,
    onDeselect,
    onMultipleSelect,
    onSingleSelect,
  } = useCombobox();

  const isDataSelected = React.useMemo(() => {
    return !!selectedOptions.find((selectedOption) => {
      const selectedOptionKey = keyExtractor(selectedOption);
      const optionKey = keyExtractor(option);
      return selectedOptionKey === optionKey;
    });
  }, [selectedOptions, option]);

  const optionLabel = React.useMemo(() => displayValueGetter(option), [option]);

  function handleOptionClick() {
    if (isDataSelected) {
      return onDeselect(option);
    }

    if (type === "multiple") {
      return onMultipleSelect(option);
    }

    onSingleSelect(option);
  }

  return (
    <TooltipProvider delayDuration={150}>
      {withTooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <li
              className={cn(
                "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-600/50",
                isDataSelected ? "bg-blue-600 text-white" : "text-gray-900",
                className
              )}
              onClick={handleOptionClick}
              {...rest}
            >
              {optionLabel}
              {isDataSelected && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
            </li>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            sideOffset={8}
            align="center"
            className="z-[10000]"
          >
            {optionLabel}
          </TooltipContent>
        </Tooltip>
      )}
      {!withTooltip && (
        <li
          className={cn(
            "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-600/50",
            isDataSelected ? "bg-blue-600 text-white" : "text-gray-900",
            className
          )}
          onClick={handleOptionClick}
          {...rest}
        >
          {optionLabel}
          {isDataSelected && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
        </li>
      )}
    </TooltipProvider>
  );
};
