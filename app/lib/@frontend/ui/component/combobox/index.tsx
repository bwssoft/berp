"use client";

import React, { useEffect } from "react";
import {
  ComboboxContextValues,
  useDeprecatedPropsConverter,
} from "./combobox.helpers";
import { ComboboxContent } from "./combobox-content";
import { ComboboxEmpty } from "./combobox-empty";
import { ComboboxLoading } from "./combobox-loading";
import { ComboboxMultipleSearch } from "./combobox-multiple-search";
import { ComboboxViewToggle } from "./combobox-source-toggle";
import { ComboboxTrigger } from "./combobox-trigger";
import { cn } from "@/app/lib/util";
import { commandScore } from "@/app/lib/util/command-score";
import { Popover, PopoverContent } from "../popover";
import { useClickOutside } from "../../../hook";

export type ComboboxType = "single" | "multiple";
export type ComboboxOptionSource = "all" | "searched" | "selected";
export type ComboboxBehavior = "select" | "search";

type PopoverRef = React.ElementRef<typeof PopoverContent>;

export type ComboboxProps<T> = {
  data: T[];
  keyExtractor: (item: T) => string;
  displayValueGetter: (item: T) => string;
  keywords?: (item: T) => string[];
  label?: string;
  className?: string;
  onChange?: (e: T[]) => void;
  placeholder?: string;
  /**
   * @deprecated Utilizar a prop "showOptionsButton".
   */
  minLengthBeforeOptionsButtonAppear?: number;

  error?: string;
  defaultValue?: T[];
  /**
   * @deprecated Utilizar a prop "type".
   */
  multiple?: boolean;
  /**
   * @deprecated Utilizar a prop "onSearchChange".
   */
  onRequestChange?: (
    event: string,
    selectedOptions?: T[]
  ) => Promise<void> | void;
  /**
   * @deprecated Utilizar a prop "isLoading".
   */
  loadingRequestChange?: boolean;
  /**
   * @deprecated Desativada. Se você possui um caso onde seja necessário reiniciar o valor
   * dos selecionados você precisa transformar o Combobox em um componente controlado passando
   * um valor de selecionados na prop "value" e modificando esse valor utilizando "onOptionChange"
   * ou "onSearchChange" (caso o seu behavior for do tipo search).
   */
  resetSelected?: boolean;
  testId?: string;
  /**
   * @deprecated Desativada. O conteúdo é envolvido no radix. O radix calcula auto.
   */
  dynamicInset?: boolean;

  /**
   * @deprecated
   */
  classNameOptions?: string;
  showOptionsButton?: boolean;

  value?: T[];

  disabled?: boolean;

  type?: ComboboxType;
  behavior?: ComboboxBehavior;
  isLoading?: boolean;

  helpText?: string;

  onOptionChange?: (selectedOptions: T[]) => void;
  onSearchChange?: (queryText: string, selectedOptions: T[]) => void;
  useSearchChangeDebounce?: boolean;
  searchChangeDebounceDelay?: number;

  /**
   * Encontrar um solução para não depender de passar modal no popover.
   * Para renderizar o combobox dentro de um modal precisa dessa prop.
   * Na tela de /admin/user/profile essa prop faz o componente se perder nas referências
   */
  modal?: boolean;
};

const ComboboxContext = React.createContext({} as ComboboxContextValues<any>);

export function Combobox<TData>({
  displayValueGetter,
  data,
  defaultValue = [],
  value,
  behavior = "select",
  multiple = true,
  loadingRequestChange,
  onChange,
  onRequestChange,
  keyExtractor,
  keywords = () => [],
  className,
  showOptionsButton = true,
  type: newComboboxType = "multiple",
  onOptionChange: newOptionChange,
  onSearchChange: newSearchChange,
  searchChangeDebounceDelay = 500,
  useSearchChangeDebounce = true,
  modal = true,
  ...props
}: ComboboxProps<TData>) {
  const { type, isLoading, onOptionChange, onSearchChange } =
    useDeprecatedPropsConverter({
      newOptionChange,
      newSearchChange,
      multiple,
      loadingRequestChange,
      onChange,
      onRequestChange,
      newComboboxType,
    });

  const [query, setQuery] = React.useState<string>("");
  const [optionsSource, setOptionsSource] =
    React.useState<ComboboxOptionSource>("all");
  const [isOptionsOpened, setIsOptionsOpened] = React.useState<boolean>(false);

  const [selectedOptions, setSelectedOptions] =
    React.useState<TData[]>(defaultValue);

  const triggerContainerRef = React.useRef<HTMLButtonElement>(null);
  const popoverContentRef = React.useRef<PopoverRef>(null);

  const options = React.useMemo(() => {
    if (optionsSource === "selected") {
      return onOptionsFilter(value ?? selectedOptions);
    }

    if (!query || optionsSource === "all") {
      return data;
    }

    return onOptionsFilter(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, optionsSource, value, data]);

  function onOptionsFilter(dataSource: TData[]) {
    if (!query) {
      return dataSource;
    }

    const result = dataSource?.filter((element) => {
      const score = commandScore(
        displayValueGetter(element),
        query,
        keywords(element)
      );
      return score > 0;
    });

    return result;
  }

  function onSingleSelect(option: TData) {
    const displayName = displayValueGetter(option);

    setQuery(displayName);

    if (behavior === "search" && onSearchChange) {
      onSearchChange(displayName, [option]);
    }

    if (behavior !== "search" && !value) {
      setSelectedOptions([option]);
    }

    onOptionChange?.([option]);
    setOptionsSource("all");
    setIsOptionsOpened(false);
  }

  function onMultipleSelect(option: TData) {
    const _selectedOptions = [...(value ?? selectedOptions), option];
    setQuery("");

    if (!value) {
      setSelectedOptions(_selectedOptions);
    }

    setOptionsSource("all");
    onOptionChange?.(_selectedOptions);
  }

  function onDeselect(option: TData) {
    const optionKey = keyExtractor(option);
    const _options = value ?? selectedOptions;

    const selected = _options.filter((selectedOption) => {
      const selectedOptionKey = keyExtractor(selectedOption);
      return selectedOptionKey !== optionKey;
    });

    if (selected.length === 0) {
      setOptionsSource("all");
    }

    if (!value) {
      setSelectedOptions([...selected]);
    }

    onOptionChange?.(selected);
  }

  function onReset() {
    setSelectedOptions([]);
    setQuery("");
    onOptionChange?.([]);
  }

  function onLoad() {
    try {
      const _value = value ?? defaultValue;
      if (type === "single" && _value && _value.length !== 0) {
        setQuery(displayValueGetter(_value[0]));
      }
    } catch {}
  }

  function onControlledValueChange() {
    if (type === "single" && value && value.length !== 0) {
      setQuery(displayValueGetter(value[0]));
    }

    if (type === "single" && (value?.length || 0) <= 0) {
      setQuery("");
    }
  }

  useClickOutside(
    [triggerContainerRef, popoverContentRef],
    (hasClickedOutside) => {
      if (isOptionsOpened && hasClickedOutside) {
        setIsOptionsOpened(false);

        if (
          behavior === "select" &&
          value?.length === 0 &&
          selectedOptions.length === 0 &&
          query
        ) {
          setQuery("");
        }
      }
    }
  );

  const onOpenAutoFocus = (e: Event) => {
    e.preventDefault();
  };

  const onCloseAutoFocus = () => {
    if (behavior === "select") {
      setOptionsSource("all");

      if (type === "multiple") {
        setQuery("");
        onSearchChange?.("", value ?? selectedOptions);
      }
    }
  };

  useEffect(() => onControlledValueChange(), [value]);
  useEffect(() => onLoad(), []);

  return (
    <ComboboxContext.Provider
      value={{
        options,
        isOptionsOpened,
        setIsOptionsOpened,
        selectedOptions: value ?? selectedOptions,
        setSelectedOptions: value ? undefined : setSelectedOptions,
        optionsSource,
        setOptionsSource,
        query,
        setQuery,
        onReset,
        keyExtractor,
        type,
        isLoading,
        onSearchChange,
        value,
        onOptionChange,
        onChange,
        behavior,
        displayValueGetter,
        onSingleSelect,
        onDeselect,
        onMultipleSelect,
        searchChangeDebounceDelay,
        useSearchChangeDebounce,
        modal,
        ...props,
      }}
    >
      <div className={cn("w-full", className)}>
        <Popover open={isOptionsOpened} modal={modal}>
          <ComboboxTrigger ref={triggerContainerRef} />

          <PopoverContent
            ref={popoverContentRef}
            align="end"
            style={{ width: triggerContainerRef.current?.clientWidth }}
            className="z-[500] flex max-h-64 flex-col overflow-y-hidden p-0"
            updatePositionStrategy="always"
            autoCorrect="false"
            // onOpenAutoFocus={onOpenAutoFocus}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <ComboboxMultipleSearch />
            <ComboboxContent />
            <ComboboxEmpty />
            <ComboboxLoading />
            {showOptionsButton && <ComboboxViewToggle />}
          </PopoverContent>
        </Popover>
      </div>
    </ComboboxContext.Provider>
  );
}

export const useCombobox = () => React.useContext(ComboboxContext);
