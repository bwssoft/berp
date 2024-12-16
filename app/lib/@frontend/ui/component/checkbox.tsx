interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  subLabel?: string;
}
export function Checkbox(props: Props) {
  const { label, subLabel, id } = props;
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        {label && (
          <label htmlFor={id} className="font-medium text-gray-900">
            {label}
          </label>
        )}
        {subLabel && <p className="text-gray-500">{subLabel}</p>}
      </div>
    </div>
  );
}
