import { IHistorical } from "@/app/lib/@backend/domain";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  PhoneIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

type TimelineProps = {
  historical: IHistorical[];
};

export function TimelineItem({ historical }: TimelineProps) {
  return (
    <div className="relative">
      <ul role="list" className="space-y-6">
        {historical.map((entry, idx) => {
          const isLast = idx === historical.length - 1;
          const isSystem = entry.type === "sistema";

          const renderIcon = () => {
            switch (entry.type) {
              case "sistema":
                return (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-lg">
                    🧠
                  </div>
                );
              case "anexo":
                return (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                    <PaperClipIcon className="w-5 h-5 text-gray-500" />
                  </div>
                );
              case "observacao":
                return (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500" />
                  </div>
                );
              default:
                return (
                  <div className="bg-white w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    {entry.author?.avatarUrl ? (
                      <img
                        src={entry.author.avatarUrl}
                        alt={entry.author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                );
            }
          };

          return (
            <li key={entry.id} className="relative flex items-start">
              {!isLast && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-300"
                  aria-hidden="true"
                />
              )}

              {/* Avatar ou ícone */}
              <div className="relative z-10">{renderIcon()}</div>

              {/* Conteúdo */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-800">
                    {entry.author?.name && (
                      <span className="font-semibold">{entry.author.name}</span>
                    )}{" "}
                    {entry.title}
                    {entry.link && (
                      <>
                        {" "}
                        (<a
                          href={entry.link.url}
                          className="text-blue-600 underline"
                        >
                          {entry.link.label}
                        </a>
                        )
                      </>
                    )}
                  </p>
                  <time className="ml-4 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </time>
                </div>

                {/* Detalhes */}
                {(entry.description || entry.type === "ligacao") && (
                  <div className="mt-1 text-sm text-gray-500">
                    {entry.type === "ligacao" && entry.action && (
                      <div className="flex items-center gap-1 font-semibold text-gray-700">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{entry.action}</span>
                      </div>
                    )}
                    {entry.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {entry.description}
                      </p>
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
