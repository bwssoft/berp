import { formatDate } from "@/app/lib/util";
import React from "react";
import { DateRange } from "react-day-picker";
import { useDebounce } from "../../../hook/use-debounce";

export interface HourRange {
  from: string;
  to: string;
}

interface UseDateRangeInputProps {
  showTime?: boolean;
  value?: DateRange;
  onChange: (value: DateRange) => void;
}

export function useDateRangeInput({
  showTime = false,
  value,
  onChange = () => {},
}: UseDateRangeInputProps) {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [hours, setHours] = React.useState<HourRange>({
    from: "00:00",
    to: "23:59",
  });

  function handleRangeChange(range: DateRange | undefined) {
    if (!range) return;

    const _range = formatRangeWithHour(hours, range);

    if (_range) {
      setRange(_range);
      onChange?.(_range);
    }
  }

  function handleHoursChange(hour: string, type: "from" | "to") {
    if (!showTime) return;

    const _hours = {
      ...hours,
      [type]: hour,
    };

    const _range = formatRangeWithHour(_hours, range);
    if (_range) {
      setRange(_range);
      setHours(_hours);
      onChange?.(_range);
    }
  }

  function formatHoursString({ withHours }: { withHours: boolean }) {
    const fromHour = withHours ? hours.from : undefined;
    const toHour = withHours ? hours.to : undefined;

    const rangeFromFieldAsString =
      range?.from && `${formatDate(range.from)} ${fromHour}`;
    const rangeToFieldAsString =
      range?.to && `${formatDate(range.to)} ${toHour}`;

    if (!rangeFromFieldAsString || !rangeToFieldAsString) {
      return "Selecione um período entre datas";
    }

    return `${rangeFromFieldAsString} - ${rangeToFieldAsString}`;
  }

  const handleHoursChangeDebounce = useDebounce(handleHoursChange, 500);

  React.useEffect(() => {
    if (value) {
      const _range = formatRangeWithHour(hours, value);
      if (_range) setRange(_range);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    range,
    hours,
    handleRangeChange,
    handleHoursChange,
    handleHoursChangeDebounce,
    formatHoursString,
  };
}

function formatDateWithHour(
  hour: string,
  date: Date | undefined,
  formatToLastSecond?: boolean
) {
  if (!date) return undefined;

  if (!hour) {
    hour = "00:00";
  }

  const [formattedHour, formattedMinute] = hour
    .split(":")
    .map((str) => parseInt(str, 10));

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    formattedHour,
    formattedMinute,
    formatToLastSecond ? 59 : 0
  );
}

function formatRangeWithHour(
  hourRange: HourRange,
  range: DateRange | undefined
) {
  if (!range) return undefined;

  const from = formatDateWithHour(hourRange.from, range.from);
  const to = formatDateWithHour(hourRange.to, range.to, true);

  return {
    from,
    to,
  };
}
