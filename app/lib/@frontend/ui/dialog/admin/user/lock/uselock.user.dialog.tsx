"use client";

import { useState } from "react";


export const useLockUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [willLock, setWillLock] = useState(true);

  const showLockDialog = (id: string) => {
    setUserId(id);
    setWillLock(true);
    setOpen(true);
  };

  const showUnlockDialog = (id: string) => {
    setUserId(id);
    setWillLock(false);
    setOpen(true);
  };

  return {
 
    dialogProps: { open, setOpen, userId, willLock } as const,
   
    showLockDialog,

    showUnlockDialog,
  };
};
