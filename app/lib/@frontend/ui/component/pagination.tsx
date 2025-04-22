import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
  totalPages: number;   
  totalItems: number;   
  limit: number;        
}

export function PaginationTailwind({
  totalPages,
  totalItems,
  limit,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const visiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [];
    const show = (p: number) => pages.push(p);

    show(1);
    if (currentPage > 4) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) show(p);

    if (currentPage < totalPages - 3) pages.push("ellipsis");
    show(totalPages);

    return pages;
  };

  const firstItem = (currentPage - 1) * limit + 1;
  const lastItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Mobile — aparece apenas em telas < 640 px */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{firstItem}</span> to{" "}
            <span className="font-medium">{lastItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span>{" "}
            {totalItems === 1 ? "result" : "results"}
          </p>
        </div>

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
            aria-label="Pagination"
          >
            {/* Prev */}
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>

            {visiblePages().map((p, idx) =>
              p === "ellipsis" ? (
                <span
                  key={`e-${idx}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${
                    p === currentPage
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 hover:bg-gray-50"
                  } ${
                    p === 1 ? "" : p === totalPages ? "" : "" 
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
