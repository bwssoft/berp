import { cn } from "@/app/lib/util";
import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassname?: string;
  required?: boolean;
  help?: string;
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
      error,
      help,
      disabled,
      required = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={cn("w-full", containerClassname)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {label} {required && <span className="!text-red-600">*</span>}
          </label>
        )}
        <div className={cn("relative", label && "mt-2")}>
          <input
            type="text"
            name={name}
            id={id}
            className={cn(
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6",
              error && "ring-red-600 focus:ring-red-600",
              disabled &&
                "bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200 placeholder:text-gray-300",
              className
            )}
            placeholder={placeholder}
            ref={ref}
            disabled={disabled}
            {...rest}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
