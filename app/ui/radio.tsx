import {
  ChangeEventHandler,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from "react";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
interface Props<T> {
  label?: string;
  keyExtractor: (arg: T) => string | number;
  valueExtractor: (arg: T) => string;
  labelExtractor: (arg: T) => string;
  data: T[];
  defaultCheckedItem: T;
  name: string;
  onChange: (arg: T) => void;
}
export default function Radio<T>(props: Props<T>) {
  const {
    label,
    keyExtractor,
    valueExtractor,
    labelExtractor,
    data,
    defaultCheckedItem,
    name,
    onChange,
    ...rest
  } = props;

  const checkDefaultChecked = (input: T) => {
    return (
      valueExtractor(defaultCheckedItem) === valueExtractor(input) &&
      keyExtractor(defaultCheckedItem) === keyExtractor(input)
    );
  };

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      onChange(defaultCheckedItem);
      firstRender.current = false;
    }
  }, [defaultCheckedItem]);

  return (
    <fieldset>
      {label && (
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          {label}
        </legend>
      )}
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {data.map((d, idx) => (
          <div key={idx} className="relative flex items-start py-4">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label
                htmlFor={`d-${keyExtractor(d)}`}
                className="select-none font-medium text-gray-900"
              >
                {labelExtractor(d)}
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id={`d-${keyExtractor(d)}`}
                name={name}
                {...rest}
                type="radio"
                defaultChecked={checkDefaultChecked(d)}
                value={valueExtractor(d)}
                onChange={() => onChange(d)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
