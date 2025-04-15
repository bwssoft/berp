"use client";
import { cn } from "@/app/lib/util";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { forwardRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassname?: string;
  type?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      id,
      name,
      placeholder,
      className,
      containerClassname,
      type="text",
      error,
      ...rest
    },
    ref
  ) => {

    const [seePassword, setSeePassword] = useState(false);
    const [typeSelect, setTypeSelect] = useState("");

    return (
      <div className={cn("w-full", containerClassname)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label}
          </label>
        )}
        <div className={cn(label && "mt-2 relative")}>
          {type == "password" && (
            seePassword ? (
              <EyeIcon onClick={() => {setSeePassword(!seePassword), setTypeSelect("password")}} className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            ) : (
              <EyeSlashIcon onClick={() => {setSeePassword(!seePassword), setTypeSelect("text")}} className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            )
          )}
          <input
            type={typeSelect ? typeSelect : type}
            name={name}
            id={id}
            className={cn(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
              className
            )}
            placeholder={placeholder}
            ref={ref}
            {...rest}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600 absolute">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
