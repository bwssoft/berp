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
  type?: "date" | "period" | "dateTime";
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
    const [isSelectingStart, setIsSelectingStart] = React.useState(true);

    const formatDisplayValue = React.useCallback(() => {
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

      if (type === "dateTime" && value instanceof Date) {
        return format(value, "dd/MM/yyyy, HH:mm", { locale: ptBR });
      }

      return (
        placeholder ||
        (type === "period" ? "Selecione período" : "Selecione data")
      );
    }, [value, type, placeholder]);

    // For dateTime type: manage time state
    const [selectedHour, setSelectedHour] = React.useState<string>("00");
    const [selectedMinute, setSelectedMinute] = React.useState<string>("00");
    const [selectedAmPm, setSelectedAmPm] = React.useState<string>("AM");

    React.useEffect(() => {
      if (type === "dateTime" && value instanceof Date) {
        let hour = value.getHours();
        let minute = value.getMinutes();
        setSelectedHour((hour % 12 || 12).toString().padStart(2, "0"));
        setSelectedMinute(minute.toString().padStart(2, "0"));
        setSelectedAmPm(hour >= 12 ? "PM" : "AM");
      }
    }, [type, value]);

    const handleSelect = React.useCallback(
      (selectedValue: Date | { from: Date; to: Date } | undefined) => {
        if (type === "period") {
          if (
            selectedValue &&
            typeof selectedValue === "object" &&
            "from" in selectedValue
          ) {
            // Check if we have a complete range already and user clicked a new date
            if (
              value &&
              typeof value === "object" &&
              "from" in value &&
              value.from &&
              value.to
            ) {
              // Reset to start new selection
              const clickedDate = selectedValue.from || selectedValue.to;
              if (clickedDate) {
                onChange?.({ from: clickedDate, to: undefined as any });
                setIsSelectingStart(false); // Next click will be end date
              }
            } else {
              // Normal range selection behavior
              onChange?.(selectedValue);

              // Update selection state
              if (selectedValue.from && !selectedValue.to) {
                setIsSelectingStart(false); // Next selection will be end date
              } else if (selectedValue.from && selectedValue.to) {
                setIsSelectingStart(true); // Range complete, next click starts new selection
              }
            }
          } else if (!selectedValue) {
            // Handle clear/reset case
            onChange?.(null);
            setIsSelectingStart(true);
          }
          // Popover stays open for period selection
        } else if (type === "dateTime") {
          // Only update date part, keep time selection
          if (selectedValue instanceof Date) {
            let date = new Date(selectedValue);
            let hour = parseInt(selectedHour, 10);
            if (selectedAmPm === "PM" && hour < 12) hour += 12;
            if (selectedAmPm === "AM" && hour === 12) hour = 0;
            date.setHours(hour, parseInt(selectedMinute, 10), 0, 0);
            onChange?.(date);
          }
        } else {
          // For single date selection, update the value and close
          onChange?.(selectedValue as Date | null);
          setOpen(false);
        }
      },
      [type, value, onChange, selectedHour, selectedMinute, selectedAmPm]
    );

    const handleOpenChange = React.useCallback(
      (isOpen: boolean) => {
        setOpen(isOpen);
        // Only update selection state when opening (not closing)
        if (isOpen && type === "period") {
          // Reset selection state when opening
          const hasCompleteRange =
            value &&
            typeof value === "object" &&
            "from" in value &&
            value.from &&
            value.to;
          setIsSelectingStart(!hasCompleteRange);
        }
      },
      [type, value]
    );

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
      if (type === "dateTime" && value instanceof Date) {
        return value.toISOString();
      }
      return "";
    }, [value, type]);

    return (
      <>
        <Popover open={open} onOpenChange={handleOpenChange}>
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
              type="button" // Explicitly set button type to prevent form submission
              {...props}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDisplayValue()}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
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
            ) : type === "dateTime" ? (
              <div className="flex flex-row h-72 items-stretch">
                <div className="flex-1 h-full overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={value as Date}
                    onSelect={handleSelect as any}
                    disabled={disabled}
                    initialFocus
                    locale={ptBR}
                  />
                </div>
                <div className="flex flex-col gap-2 p-4 min-w-[140px] h-full">
                  <div className="flex gap-2 h-full">
                    <div className="flex gap-2 h-full">
                      <div className="w-20 h-full overflow-y-auto border rounded scrollbar-thin scrollbar-thumb-gray-400/40 time-scroll">
                        {Array.from({ length: 12 }, (_, i) => {
                          const h = (i + 1).toString().padStart(2, "0");
                          return (
                            <button
                              key={h}
                              type="button"
                              className={cn(
                                "w-full text-left px-2 py-1 hover:bg-blue-100",
                                selectedHour === h && "bg-blue-200"
                              )}
                              onClick={() => {
                                setSelectedHour(h);
                                if (value instanceof Date) {
                                  const date = new Date(value);
                                  let hour = parseInt(h, 10);
                                  if (selectedAmPm === "PM" && hour < 12)
                                    hour += 12;
                                  if (selectedAmPm === "AM" && hour === 12)
                                    hour = 0;
                                  date.setHours(hour, date.getMinutes(), 0, 0);
                                  onChange?.(date);
                                }
                              }}
                            >
                              {h}
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-20 h-full overflow-y-auto border rounded scrollbar-thin scrollbar-thumb-gray-400/40 time-scroll">
                        {Array.from({ length: 60 }, (_, i) => {
                          const m = i.toString().padStart(2, "0");
                          return (
                            <button
                              key={m}
                              type="button"
                              className={cn(
                                "w-full text-left px-2 py-1 hover:bg-blue-100",
                                selectedMinute === m && "bg-blue-200"
                              )}
                              onClick={() => {
                                setSelectedMinute(m);
                                if (value instanceof Date) {
                                  const date = new Date(value);
                                  date.setMinutes(parseInt(m, 10), 0, 0);
                                  onChange?.(date);
                                }
                              }}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-col justify-start gap-2">
                        {(["AM", "PM"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={cn(
                              "px-3 py-1 border rounded hover:bg-blue-100",
                              selectedAmPm === p && "bg-blue-200"
                            )}
                            onClick={() => {
                              setSelectedAmPm(p);
                              if (value instanceof Date) {
                                const date = new Date(value);
                                let hour = date.getHours();
                                if (p === "PM" && hour < 12) hour += 12;
                                if (p === "AM" && hour >= 12) hour -= 12;
                                date.setHours(hour, date.getMinutes(), 0, 0);
                                onChange?.(date);
                              }
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        <style jsx>{`
          .time-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .time-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(148, 163, 184, 0.45);
            border-radius: 9999px;
          }
          .time-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.45) transparent;
          }
        `}</style>
      </>
    );
  }
);

DateInput.displayName = "DateInput";
