"use client";
interface Props<T> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  data: T[];
  keyExtractor: (arg: T) => string | number;
  valueExtractor: (arg: T) => string;
  labelExtractor: (arg: T) => string;
  onChangeSelect?: (arg: T | undefined) => void;
  placeholder?: string;
}

export function Select<T>(props: Props<T>) {
  const {
    data,
    keyExtractor,
    valueExtractor,
    labelExtractor,
    onChangeSelect,
    placeholder,
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedItem = data.find(
      (item) => valueExtractor(item) === selectedValue
    );
    onChangeSelect?.(selectedItem);
  };

  return (
    <select
      id="input_id"
      name="input_id"
      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={handleChange}
    >
      {placeholder && <option>{placeholder}</option>}
      {data.map((d) => (
        <option key={keyExtractor(d)} value={valueExtractor(d)}>
          {labelExtractor(d)}
        </option>
      ))}
    </select>
  );
}
