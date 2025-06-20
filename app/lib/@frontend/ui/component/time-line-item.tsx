import { UserCircleIcon } from "@heroicons/react/20/solid";
import { PhoneIcon } from "@heroicons/react/24/outline";

type TimelineEntry = {
  author: string;
  action: string;
  link?: { label: string; url: string };
  details?: string;
  timestamp: string;
};

type TimelineProps = {
  item: TimelineEntry[];
};

export function TimelineItem({ item }: TimelineProps) {
  return (
    <div className="relative">
      <ul role="list" className="space-y-6">
        {item.map((entry, idx) => {
          const isLast = idx === item.length - 1;
          const isSystem = entry.author === "Sistema";
          return (
            <li key={idx} className="relative flex items-start">
              {/* Linha vertical */}
              {!isLast && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-300"
                  aria-hidden="true"
                />
              )}

              {/* Avatar ou Emoji */}
              <div className="relative z-10">
                {isSystem ? (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white ">
                    🧠
                  </div>
                ) : (
                  <div className="bg-white w-full rounded-full">
                    <UserCircleIcon className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{entry.author}</span>{" "}
                    {entry.link ? (
                      <>
                        {entry.action}{" "}
                        <a
                          href={entry.link.url}
                          className="text-blue-600 underline"
                        >
                          {entry.link.label}
                        </a>
                      </>
                    ) : (
                      entry.action
                    )}
                  </p>
                  <time className="ml-4 text-xs text-gray-400 whitespace-nowrap">
                    {entry.timestamp}
                  </time>
                </div>

                {entry.details && (
                  <div className="mt-1 text-sm text-gray-500">
                    {/* Se começar com 📞, renderiza ícone + bold */}
                    {entry.action.startsWith("📞") ? (
                      <div>
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <PhoneIcon className="h-4 w-4" />
                          {entry.action.replace("📞 ", "")}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {entry.details}
                        </p>
                      </div>
                    ) : (
                      <p>{entry.details}</p>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
