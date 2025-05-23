"use client";

import { Button } from "@/app/lib/@frontend/ui/component";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export function PageFooterButtons({ id }: Props) {
  const router = useRouter();

  return (
    <div className="flex gap-4 items-end justify-end mt-4">
      <Button type="button" variant="ghost">
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={() => router.push(`/commercial/account?id=${id}`)}
      >
        Salvar e próximo
      </Button>
    </div>
  );
}
