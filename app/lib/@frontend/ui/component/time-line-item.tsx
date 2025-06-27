import { IHistorical } from "@/app/lib/@backend/domain";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  PaperClipIcon,
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
                    <img 
                      src={"/bcube-logo.svg"} 
                      alt="" 
                      className="mx-auto h-10 w-auto"
                    />
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
              {isSystem && (
                <>
                  <div className="relative z-10">{renderIcon()}</div>

                  <div className="ml-4 flex-1 items-center">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-800 flex gap-1 items-center justify-center">
                        <span className="font-semibold">Sistema</span> 
                        <p className="text-gray-500 text-sm">{entry.title}</p>
                      </div>
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
                  </div>
                </>
              )}
              {!(entry.type == "manual") && !(entry.type == "sistema") && (
                <>
                  <div className="relative z-10">{renderIcon()}</div>

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="text-gray-800 text-sm flex gap-1 items-center justify-center">
                        <span className="font-semibold">{entry.author?.name}</span>
                        <p className="text-gray-500">{entry.title}</p>
                        <p className="text-gray-500">(nº<a className="text-blue-600 underline" href="">{entry.action}</a>)</p>
                        <p className="text-gray-500">{entry.description}</p>
                      </div>
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
                  </div>
                </>
              )}
              {entry.type == "manual" && !entry.file && (
                <>
                  <div className="relative z-10">{renderIcon()}</div>

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-800 flex items-center justify-center">
                        <span className="font-bold text-sm">{entry.author?.name}</span>
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
                    <div className="">
                      {entry.contacts && (
                        <h4 className="text-sm font-bold">{entry.contacts?.name} - {entry.contacts?.type} {entry.contacts?.contact}</h4>
                      )}
                      <p className="text-sm text-gray-500">{entry.description}</p>
                    </div>
                  </div>
                </>
              )}
              {entry.type == "manual" && entry.file && (
                <>
                  <div className="relative z-10">{renderIcon()}</div>

                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-800 flex items-center justify-center">
                        <span className="font-bold text-sm">{entry.author?.name }</span>
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
                    <div className="flex items-center gap-2">
                      <PaperClipIcon className="w-3 h-3 text-gray-400" />
                      <a
                        href={entry.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {entry.file.name || "Arquivo"}
                      </a>
                    </div>
                      <p className="text-sm text-gray-500">{entry.description}</p>
                  </div>
                </>
              )}

            </li>
          );
        })}
      </ul>
    </div>
  );
}
