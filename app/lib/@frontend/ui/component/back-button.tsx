"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
    >
      <ChevronLeftIcon className="size-5 mr-2" />
      Voltar
    </button>
  );
}
