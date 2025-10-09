"use client";
import {IHistorical} from "@/app/lib/@backend/domain/commercial/entity/historical.definition";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  EnvelopeIcon,
  PaperClipIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../component/button";
import { WhatsappIcon } from "../../../../svg/whatsapp-icon";
import { EditedFieldsTable } from "../../../table/commercial/historical/edited-fields/table";
import { Pagination } from "../../../component/pagination";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";

type TimelineProps = {
  historical: PaginationResult<IHistorical> | null;
  onClickButtonDownload: (id: string, name: string) => void;
  currentPage?: number;
};

export function TimelineTable({
  historical,
  onClickButtonDownload,
  currentPage = 1,
}: TimelineProps) {
  console.log("🚀 ~ TimelineTable ~ currentPage:", currentPage);
  console.log("🚀 ~ TimelineTable ~ historical:", historical);
  const docs = historical?.docs ?? [];
  const { handleParamsChange } = useHandleParamsChange();
  const formatDate = (date: string | Date) =>
    new Date(
      typeof date === "string" ? date : date.toISOString()
    ).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const renderIcon = (entry: IHistorical) => {
    if (entry.type === "sistema") {
      return (
        <img
          src="/bcube-logo.svg"
          alt="Sistema"
          className="w-8 h-8 object-contain"
        />
      );
    }

    if (entry.author?.avatarUrl) {
      return (
        <img
          src={entry.author.avatarUrl}
          alt={entry.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    return <UserCircleIcon className="w-10 h-10 text-gray-300" />;
  };

  return (
    <div className="relative w-full">
      <ul role="list" className="space-y-6">
        {docs.map((entry, idx) => {
          const isLast = idx === docs.length - 1;

          return (
            <li key={entry.id} className="relative flex items-start">
              {!isLast && (
                <span
                  className="absolute left-[1.25rem] top-6 h-full w-px bg-gray-200"
                  aria-hidden="true"
                />
              )}

              {/* Ícone */}
              <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200">
                {renderIcon(entry)}
              </div>

              {/* Conteúdo */}
              <div className="ml-4 flex-1">
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-4 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm flex gap-1 font-medium text-gray-900">
                      {entry.type === "sistema" ? (
                        <p className="font-bold">Sistema</p>
                      ) : (
                        <p className="font-bold">
                          {entry.author?.name || "Usuário"}
                        </p>
                      )}
                      {entry.title && (
                        <p className="font-medium text-gray-600">
                          {entry.title}
                        </p>
                      )}
                      {entry.action && (
                        <p className="text-gray-500">
                          Ação nº{" "}
                          <a href="#" className="text-blue-600 underline">
                            {entry.action}
                          </a>
                        </p>
                      )}
                    </div>
                    <time className="text-xs text-gray-400">
                      {formatDate(entry.created_at)}
                    </time>
                  </div>

                  <div className="space-y-1 text-sm text-gray-700">
                    {entry.contacts && (
                      <div className="text-sm flex gap-1 items-center text-gray-500">
                        {entry.contacts.type.includes("Telefone") && (
                          <PhoneIcon className="w-4 h-4" />
                        )}
                        {entry.contacts.type === "Email" && (
                          <EnvelopeIcon className="w-4 h-4" />
                        )}
                        {entry.contacts.type === "Celular" && (
                          <PhoneIcon className="w-4 h-4" />
                        )}
                        {entry.contacts.type === "Whatsapp" && (
                          <WhatsappIcon classname="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {entry.contacts.name} - {entry.contacts.type}
                        </span>{" "}
                        {entry.contacts.contact}
                      </div>
                    )}
                    {entry.description && <p>{entry.description}</p>}

                    {entry.editedFields && (
                      <EditedFieldsTable data={entry.editedFields} />
                    )}

                    {entry.file && entry.file && (
                      <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PaperClipIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {entry.file.name}
                          </span>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={() =>
                            entry.file?.id &&
                            entry.file.name &&
                            onClickButtonDownload(
                              entry.file.id,
                              entry.file.name
                            )
                          }
                          className="flex items-center gap-1"
                          disabled={!entry.file?.url || !entry.file?.id}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Baixar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={historical?.pages ?? 1}
          totalItems={historical?.total ?? 0}
          limit={historical?.limit ?? 10}
          onPageChange={(page: number) => handleParamsChange({ page })}
        />
      </div>
    </div>
  );
}
