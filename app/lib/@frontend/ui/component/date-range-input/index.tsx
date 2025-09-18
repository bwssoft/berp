import * as React from "react";
import {
  Calendar1Icon,
  CalendarDaysIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { cn } from "@/app/lib/util";

import { ptBR } from "date-fns/locale";
import { Input } from "../input";
import { useDateRangeInput } from "./use-date-range-input";

interface DateRangeInputProps {
  label?: string;
  value?: DateRange;
  onChange?: (date: DateRange) => void;
  showTimeInputs?: boolean;
}

export function DateRangeInput({
  label,
  value,
  onChange = () => {},
  showTimeInputs = true,
}: DateRangeInputProps) {
  const {
    range,
    hours,
    handleHoursChange,
    handleRangeChange,
    formatHoursString,
  } = useDateRangeInput({
    value,
    onChange,
    showTime: showTimeInputs,
  });

  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className={cn(
              "font-normal w-full justify-between !px-3 overflow-hidden",
              range?.from && range?.to
                ? "!text-foreground"
                : "!text-muted-foreground/80"
            )}
          >
            <CalendarDaysIcon size={20} className="text-muted-foreground" />

            <span
              className={cn(
                "text-sm text-foreground",
                (!range?.from || !range?.to) && "text-muted-foreground"
              )}
            >
              {formatHoursString({ withHours: showTimeInputs })}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={(selected) => handleRangeChange(selected)}
            locale={ptBR}
          />

          <div className="flex items-center gap-2 p-2 border-t">
            <div className="w-full">
              <Label htmlFor="time-from" className="sr-only">
                Start Time
              </Label>
              <Input
                id="time-from"
                type="time"
                step="1"
                value={hours.from}
                onChange={(event) =>
                  handleHoursChange(event.target.value, "from")
                }
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <span>-</span>
            <div className="w-full">
              <Label htmlFor="time-to" className="sr-only">
                End Time
              </Label>
              <Input
                id="time-to"
                type="time"
                step="1"
                value={hours.to}
                onChange={(event) =>
                  handleHoursChange(event.target.value, "to")
                }
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
