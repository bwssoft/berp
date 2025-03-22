import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

const data_analysis: Record<string, string> = {
  true: "text-green-500",
  false: "text-red-500",
};

// Função auxiliar para unificar a lógica de status
const getStatusProps = (value: boolean) => {
  const statusClass =
    data_analysis[String(value) as keyof typeof data_analysis];
  const Icon = value ? CheckIcon : XMarkIcon;
  const text = value ? "Success" : "Failed";
  return { Icon, statusClass, text };
};

export { getStatusProps };
