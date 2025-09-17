import { exportConfigurationLog } from "@/app/lib/@backend/action/production/configuration-log.action";
import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
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

export const useConfigurationLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const [isPending, startTransition] = React.useTransition();

  const searchForm = useForm<SearchConfigurationLogFormData>({
    resolver: zodResolver(schema),
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

  return {
    isPending,
    searchForm,
    handleExport,
    handleSubmit,
  };
};
