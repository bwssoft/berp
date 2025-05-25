"use client";

import { useEffect, useState } from "react";
import { Label } from "@headlessui/react";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component";
import { cn } from "@/app/lib/util/cn";

export function Select<T>(props: {
  data: T[];
  keyExtractor: (arg: T) => string | number;
  valueExtractor: (arg: T) => string | number;
  labelExtractor: (arg: T) => string | number;
  label?: string;
  onChange?: (arg: T) => void;
  name: string;
  value?: T;
  placeholder?: string;
  error?: string;
  help?: string;
}) {
  const {
    data,
    keyExtractor,
    valueExtractor,
    labelExtractor,
    label,
    onChange,
    name,
    value,
    placeholder,
    error,
    help,
  } = props;

  const [selected, setSelected] = useState<T | undefined>(undefined);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleOnChange = (selectedValue: string) => {
    const found = data.find(
      (item) => String(valueExtractor(item)) === selectedValue
    );
    if (found) {
      setSelected(found);
      onChange?.(found);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Label>
      )}
      <div className={cn(label && "mt-2")}>
        <ShadSelect
          name={name}
          value={selected ? String(valueExtractor(selected)) : ""}
          onValueChange={handleOnChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder ?? "Selecione uma opção"} />
          </SelectTrigger>
          <SelectContent>
            {data.map((item) => (
              <SelectItem
                key={keyExtractor(item)}
                value={String(valueExtractor(item))}
              >
                {labelExtractor(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadSelect>
        {help && <p className="mt-2 text-sm text-gray-400">{help}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
