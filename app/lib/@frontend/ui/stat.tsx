interface Props {
  name: string;
  value: string;
}
export function Stat(props: Props) {
  return (
    <div
      key={props.name}
      className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
    >
      <dt className="text-sm font-medium leading-6 text-gray-500">
        {props.name}
      </dt>
      <dd
        className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 truncate"
        title={props.value}
      >
        {props.value}
      </dd>
    </div>
  );
}
