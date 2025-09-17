import React from "react";

export interface IDisclosureComponentProps {
  open: boolean;
  onRequestClose: () => void;
}

export type IUseDisclosureHook<TData> = ReturnType<typeof useDisclosure<TData>>;

export function useDisclosure<TData>() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<TData>();

  const onOpen = React.useCallback(function openDisclosure(_data?: TData) {
    setIsOpen(true);
    setData(_data);
  }, []);

  const onClose = React.useCallback(function closeDisclosure() {
    setIsOpen(false);
    if (data) setData(undefined);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    data,
  };
}
