import { useMemo } from "react";
import { ComboboxOptionSource, ComboboxProps, ComboboxType } from "./index";

export interface ComboboxContextValues<TData>
  extends Omit<ComboboxProps<TData>, "data"> {
  options: TData[];

  isOptionsOpened: boolean;
  setIsOptionsOpened: React.Dispatch<React.SetStateAction<boolean>>;

  selectedOptions: TData[];
  setSelectedOptions?: React.Dispatch<React.SetStateAction<TData[]>>;

  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

  optionsSource: ComboboxOptionSource;
  setOptionsSource: React.Dispatch<React.SetStateAction<ComboboxOptionSource>>;

  onReset: () => void;
  onSingleSelect: (option: TData) => void;
  onMultipleSelect: (option: TData) => void;
  onDeselect: (option: TData) => void;
}

interface ConvertDeprecatedPropsParams<TData> {
  multiple?: boolean;
  loadingRequestChange?: boolean;
  onChange?: (data: TData[]) => void;
  onRequestChange?: (
    data: string,
    selectedOptions: TData[]
  ) => Promise<void> | void;

  newOptionChange?: (selectedOptions: TData[]) => void;
  newSearchChange?: (queryText: string, selectedOptions: TData[]) => void;

  newComboboxType?: "single" | "multiple";
}

export function useDeprecatedPropsConverter<TData>({
  multiple,
  loadingRequestChange,
  onChange,
  onRequestChange,
  newOptionChange,
  newSearchChange,
  newComboboxType,
}: ConvertDeprecatedPropsParams<TData>) {
  const type: ComboboxType = useMemo(() => {
    if (newComboboxType) return newComboboxType;

    if (multiple !== undefined && multiple) {
      return "multiple";
    }

    return "single";
  }, [multiple]);

  const isLoading = useMemo(() => {
    return !!(loadingRequestChange !== undefined && loadingRequestChange);
  }, [loadingRequestChange]);

  const onOptionChange = newOptionChange ?? onChange;
  const onSearchChange = newSearchChange ?? onRequestChange;

  return {
    type,
    isLoading,
    onOptionChange,
    onSearchChange,
  };
}
