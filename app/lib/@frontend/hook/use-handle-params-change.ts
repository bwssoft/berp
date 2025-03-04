import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function useHandleParamsChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleParamsChange = (paramsToUpdate: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  return { handleParamsChange };
}
