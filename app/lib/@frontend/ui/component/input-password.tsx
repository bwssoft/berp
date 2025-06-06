"use client";

import { useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/util"; 
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;            
  containerClassName?: string;
  label?: string
};

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label, id, error, className, containerClassName, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-md border px-3 py-2 pr-10 outline-none",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-9 right-3"
          tabIndex={-1}       
        >
          {visible ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
