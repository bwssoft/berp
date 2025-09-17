import { exportConfigurationLog } from "@/app/lib/@backend/action/production/configuration-log.action";
import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { ConfiguratorPageSearchParams } from "@/app/production/log/configurator/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "mongodb";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  query: z.string().optional(),
  created_at: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

type SearchConfigurationLogFormData = z.infer<typeof schema>;

interface UseConfigurationLogSearchFormProps {
  searchParams: ConfiguratorPageSearchParams;
}

export const useConfigurationLogSearchForm = ({
  searchParams,
}: UseConfigurationLogSearchFormProps) => {
  const { handleParamsChange, handleResetParams } = useHandleParamsChange();

  const [isPending, startTransition] = React.useTransition();

  const searchForm = useForm<SearchConfigurationLogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: searchParams.query,
      created_at: {
        from: searchParams.from,
        to: searchParams.to,
      },
    },
  });

  const handleSubmit = searchForm.handleSubmit(
    handleSucceededSubmit,
    handleFailedSubmit
  );

  const handleExport = async (filter: Filter<IConfigurationLog>) => {
    const url = await exportConfigurationLog(filter);
    window.location.href = url;
  };

  function handleSucceededSubmit(data: SearchConfigurationLogFormData) {
    startTransition(() => {
      handleParamsChange({
        query: data.query,
        from: data.created_at?.from?.toISOString(),
        to: data.created_at?.to?.toISOString(),
      });
    });
  }

  function handleFailedSubmit(error: any) {
    console.log("🚀 ~ handleFailedSubmit ~ error:", error);
  }

  function handleReset() {
    startTransition(() => {
      handleResetParams();
      searchForm.reset({
        created_at: {
          from: undefined,
          to: undefined,
        },
        query: undefined,
      });
    });
  }

  const shouldShowResetButton = React.useMemo(() => {
    const keysCount = Object.keys(searchParams).length;

    if (keysCount === 0 || (keysCount === 1 && "page" in searchParams)) {
      return false;
    }

    return true;
  }, [searchParams]);

  return {
    isPending,
    searchForm,
    handleExport,
    handleSubmit,
    handleReset,
    shouldShowResetButton,
  };
};
