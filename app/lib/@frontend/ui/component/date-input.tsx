"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/app/lib/util";

export interface DateInputProps {
  type?: "date" | "period";
  value?: Date | { from: Date; to: Date } | null;
  onChange?: (value: Date | { from: Date; to: Date } | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
}

export const DateInput = React.forwardRef<HTMLButtonElement, DateInputProps>(
  (
    {
      type = "date",
      value,
      onChange,
      placeholder,
      className,
      disabled = false,
      name,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const formatDisplayValue = () => {
      if (!value) {
        return (
          placeholder ||
          (type === "period" ? "Selecione período" : "Selecione data")
        );
      }

      if (
        type === "period" &&
        value &&
        typeof value === "object" &&
        "from" in value
      ) {
        if (value.from && value.to) {
          return `${format(value.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(
            value.to,
            "dd/MM/yyyy",
            { locale: ptBR }
          )}`;
        }
        if (value.from) {
          return format(value.from, "dd/MM/yyyy", { locale: ptBR });
        }
      }

      if (type === "date" && value instanceof Date) {
        return format(value, "dd/MM/yyyy", { locale: ptBR });
      }

      return (
        placeholder ||
        (type === "period" ? "Selecione período" : "Selecione data")
      );
    };

    const handleSelect = (
      selectedValue: Date | { from: Date; to: Date } | undefined
    ) => {
      if (type === "period") {
        console.log("Period selection:", selectedValue);
        
        // For period type, NEVER close the popover automatically
        // Only update the value, let user close manually
        if (selectedValue && typeof selectedValue === "object" && "from" in selectedValue) {
          onChange?.(selectedValue);
          // Do NOT close the popover - let user continue selecting or close manually
        } else if (!selectedValue) {
          // Handle clear/reset case
          onChange?.(null);
          // Do NOT close the popover
        }
        // Popover stays open for period selection
      } else {
        // For single date selection, update the value and close
        onChange?.(selectedValue as Date | null);
        setOpen(false);
      }
    };

    // Hidden input for form integration
    const hiddenInputValue = React.useMemo(() => {
      if (!value) return "";

      if (
        type === "period" &&
        value &&
        typeof value === "object" &&
        "from" in value
      ) {
        if (value.from && value.to) {
          return `${format(value.from, "yyyy-MM-dd")},${format(value.to, "yyyy-MM-dd")}`;
        }
        if (value.from) {
          return format(value.from, "yyyy-MM-dd");
        }
      }

      if (type === "date" && value instanceof Date) {
        return format(value, "yyyy-MM-dd");
      }

      return "";
    }, [value, type]);

    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
              disabled={disabled}
              {...props}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDisplayValue()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
            {type === "period" ? (
              <Calendar
                mode="range"
                selected={value as { from: Date; to: Date }}
                onSelect={handleSelect as any}
                disabled={disabled}
                initialFocus
                locale={ptBR}
                numberOfMonths={2}
                captionLayout="dropdown"
              />
            ) : (
              <Calendar
                mode="single"
                selected={value as Date}
                onSelect={handleSelect as any}
                disabled={disabled}
                initialFocus
                locale={ptBR}
              />
            )}
          </PopoverContent>
        </Popover>

        {/* Hidden input for form integration */}
        {name && (
          <input type="hidden" name={name} value={hiddenInputValue} readOnly />
        )}
      </>
    );
  }
);

DateInput.displayName = "DateInput";
