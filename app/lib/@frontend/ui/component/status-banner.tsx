"use client";

import { cn } from "@/app/lib/util";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import React from "react";

export type Status = "green" | "yellow" | "red";

type Props = {
  status?: Status | null;
  message?: string | string[];
  className?: string;
  statusStyles?: Record<Status, string>;
  iconClassName?: string;
};

const DEFAULT_STATUS_STYLES: Record<Status, string> = {
  green: "border-l-green-400 bg-green-50",
  yellow: "border-l-amber-400 bg-amber-50",
  red: "border-l-red-400 bg-red-50",
};

const ICON_COLOR: Record<Status, string> = {
  green: "text-[#3cd59d]",
  yellow: "text-[#fcc73e]",
  red: "text-[#f87272]",
};

const TEXT_COLOR: Record<Status, string> = {
  green: "text-[#6cb39d]",
  yellow: "text-[#b77f58]",
  red: "text-[#ad4444]",
};

const ICON_BY_STATUS: Record<Status, typeof CheckCircleIcon> = {
  green: CheckCircleIcon,
  yellow: ExclamationTriangleIcon,
  red: XCircleIcon,
};

export function StatusBanner({
  status,
  message,
  className,
  statusStyles = DEFAULT_STATUS_STYLES,
  iconClassName = "h-6 w-6",
}: Props) {
  if (!status) return null;

  const Icon = ICON_BY_STATUS[status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-4 rounded-md px-4 border-l-4",
        statusStyles[status],
        className
      )}
    >
      <Icon className={cn(ICON_COLOR[status], iconClassName)} />

      {Array.isArray(message) ? (
        <ul className={cn("font-medium text-sm list-disc pl-4", TEXT_COLOR[status])}>
          {message.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      ) : (
        <p className={cn("font-medium text-sm", TEXT_COLOR[status])}>{message}</p>
      )}
    </div>
  );
}
