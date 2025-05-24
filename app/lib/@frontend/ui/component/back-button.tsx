"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="px-2 py-4"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="size-4" />
    </Button>
  );
}
