"use client";
import { useAuth } from "@/app/lib/@frontend/context";
import { GridList } from "@/app/lib/@frontend/ui/component";
import {
  Cog6ToothIcon,
  TagIcon,
  ArrowsRightLeftIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"; // ícones adequados para o contexto de insumos

const actions = [
  {
    title: "Gestão",
    href: "/engineer/input/management",
    code: "engineer:input",
    icon: Cog6ToothIcon, // Gestão geral/configuração
    iconForeground: "text-rose-700",
    iconBackground: "bg-rose-50",
    description:
      "Gerencie os insumos utilizados no sistema e configure regras específicas.",
  },
  {
    title: "Categorias",
    href: "/engineer/input/category",
    code: "engineer:input:category",
    icon: TagIcon, // Ícone clássico de categorização
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
    description:
      "Organize os insumos em categorias para facilitar a visualização e controle.",
  },
  {
    title: "Entradas e Saídas",
    href: "/engineer/input/transaction",
    code: "engineer:input:transaction",
    icon: ArrowsRightLeftIcon, // Representa movimentações de estoque
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
    description:
      "Registre e monitore a movimentação de entrada e saída de insumos.",
  },
  {
    title: "Estoque",
    href: "/engineer/input/stock",
    code: "engineer:input:inventory",
    icon: ArchiveBoxIcon, // Representa armazenamento/estoque
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
    description:
      "Visualize os níveis de estoque atuais e mantenha o controle atualizado.",
  },
  {
    title: "Análise do estoque",
    href: "/engineer/input/analysis",
    code: "engineer:input:analyse",
    icon: ChartBarIcon, // Representa gráficos/relatórios
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
    description:
      "Acompanhe métricas e tendências para uma gestão inteligente do estoque.",
  },
];

export default function Page() {
  const { navigationByProfile} = useAuth();
  const options = navigationByProfile(actions);
  
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Módulo Engenharia - Inumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Esse módulo é responsável pelas funcionalidades de insumos para a
            Engenharia.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <GridList actions={options} className="bg-unset" />
      </div>
    </div>
  );
}
