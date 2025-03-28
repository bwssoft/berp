import { cn } from "@/app/lib/util";
import { ForwardRefExoticComponent, SVGProps } from "react";

interface Props {
  actions: {
    title: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref">>;
    iconForeground: string;
    iconBackground: string;
    description?: string;
  }[];
  className?: string;
}

export function GridList(props: Props) {
  const { actions, className } = props;
  return (
    <div
      className={cn(
        "divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0",
        className
      )}
    >
      {actions.map((action, actionIdx) => (
        <div
          key={action.title}
          className={cn(
            actionIdx === 0
              ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
              : "",
            actionIdx === 1 ? "sm:rounded-tr-lg" : "",
            actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
            actionIdx === actions.length - 1
              ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
              : "",
            "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
          )}
        >
          <div>
            <span
              className={cn(
                action.iconBackground,
                action.iconForeground,
                "inline-flex rounded-lg p-3 ring-4 ring-white"
              )}
            >
              <action.icon aria-hidden="true" className="size-6" />
            </span>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900">
              <a href={action.href} className="focus:outline-none">
                {/* Extend touch target to entire panel */}
                <span aria-hidden="true" className="absolute inset-0" />
                {action.title}
              </a>
            </h3>
            {action?.description ? (
              <p className="mt-2 text-sm text-gray-500">{action.description}</p>
            ) : (
              <></>
            )}
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="size-6">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
