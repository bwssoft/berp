"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useHandleParamsChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = useCallback(
    (paramsToUpdate: Record<string, any>) => {
      // Cria uma instância a partir dos parâmetros atuais
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", "1");

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        // Remove o parâmetro atual para evitar duplicatas
        params.delete(key);

        if (value) {
          // Se for um array, adiciona cada valor separadamente
          if (Array.isArray(value)) {
            value.forEach((item) => {
              params.append(key, item.toString());
            });
          } else {
            // Caso seja um valor único
            params.set(key, value.toString());
          }
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleResetParams = useCallback(
    (paramsToMantain?: Record<string, any>) => {
      // Cria uma instância a partir dos parâmetros atuais
      const params = new URLSearchParams();

      params.set("page", "1");

      if (paramsToMantain) {
        Object.entries(paramsToMantain).forEach(([key, value]) => {
          // Remove o parâmetro atual para evitar duplicatas
          params.delete(key);

          if (value) {
            // Se for um array, adiciona cada valor separadamente
            if (Array.isArray(value)) {
              value.forEach((item) => {
                params.append(key, item.toString());
              });
            } else {
              // Caso seja um valor único
              params.set(key, value.toString());
            }
          }
        });
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  return { handleParamsChange, handleResetParams };
}
