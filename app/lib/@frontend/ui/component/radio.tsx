"use client";

import { useEffect, useState } from "react";

export function Radio<T>(props: {
  data: T[];
  keyExtractor: (arg: T) => string | number;
  labelExtractor: (arg: T) => string | number;
  valueExtractor: (arg: T) => unknown; // pode ser qualquer tipo: string, number, object, array
  label?: string;
  help?: string;
  error?: string;
  onChange?: (arg: T) => void;
  name: string;
  defaultValue?: T;
}) {
  const {
    label,
    data,
    keyExtractor,
    labelExtractor,
    valueExtractor,
    defaultValue,
    onChange,
    name,
    help,
    error,
  } = props;

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  // Atualiza selectedValue quando defaultValue mudar
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  // Função para comparar valores extraídos
  const isSelected = (a: T, b: T) => {
    return (
      JSON.stringify(valueExtractor(a)) === JSON.stringify(valueExtractor(b))
    );
  };

  return (
    <fieldset className="w-full">
      {label && (
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          {label}
        </legend>
      )}
      {error && <p className="mt-2 text-sm text-red-600 absolute">{error}</p>}
      {help && <p className={"mt-2 text-sm text-gray-400"}>{help}</p>}
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {data.map((op, opIdx) => (
          <div
            key={keyExtractor(op)}
            className="relative flex items-start justify-start py-4"
          >
            <div className="mr-3 flex h-6 items-center">
              <input
                id={`radio-${keyExtractor(op)}`}
                name={name}
                type="radio"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                checked={selectedValue ? isSelected(op, selectedValue) : false}
                onChange={() => {
                  setSelectedValue(op);
                  onChange?.(op);
                }}
              />
            </div>
            <div className="min-w-0 text-sm leading-6">
              <label
                htmlFor={`radio-${keyExtractor(op)}`}
                className="select-none font-medium text-gray-900"
              >
                {String(labelExtractor(op))}
              </label>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
