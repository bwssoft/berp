"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component";
import { PriceTableFilterForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/search/search.price-table.form";
import { PriceTableTable } from "@/app/lib/@frontend/ui/table/commercial/price-table/price-table.table";
import { PlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface Props {
  searchParams: {
    page?: string;
    name?: string;
    type?: string;
    status?: string;
    created_date?: string;
    start_date?: string;
    end_date?: string;
  };
}

// Mocked data - this would come from a useQuery hook in real implementation
const mockPriceTables = [
  {
    id: 1,
    name: "Maio 2025 (Provisória) 2",
    createdDate: "02/06/2025 09:20:00",
    startDate: "11/05/2025 00:00:00",
    endDate: "14/05/2025 23:59:00",
    type: "Provisória",
    status: "Ativa",
  },
  {
    id: 2,
    name: "Maio 2025",
    createdDate: "25/04/2025 14:12:14",
    startDate: "01/05/2025 00:00:00",
    endDate: "-",
    type: "Normal",
    status: "Em Pausa",
  },
  {
    id: 3,
    name: "Junho 2025",
    createdDate: "08/05/2025 08:05:40",
    startDate: "-",
    endDate: "-",
    type: "Normal",
    status: "Rascunho",
  },
  {
    id: 4,
    name: "Junho 2025 (Provisória)",
    createdDate: "04/05/2025 16:45:05",
    startDate: "05/06/2025 00:00:00",
    endDate: "07/06/2025 23:59:00",
    type: "Provisória",
    status: "Aguardando Publicação",
  },
  {
    id: 5,
    name: "Maio 2025 (Provisória) 1",
    createdDate: "03/05/2025 13:15:20",
    startDate: "02/05/2025 00:00:00",
    endDate: "03/05/2025 23:59:00",
    type: "Provisória",
    status: "Inativa",
  },
  {
    id: 6,
    name: "Abril 2025",
    createdDate: "27/03/2025 09:15:10",
    startDate: "01/04/2025 00:00:00",
    endDate: "30/04/2025 23:59:00",
    type: "Normal",
    status: "Cancelada",
  },
];

export default function PriceTablePage(props: Props) {
  const {
    searchParams: { page, ...rest },
  } = props;
  const _page = page ? Number(page) : 1;

  // Mock pagination data - in real implementation this would come from an API call
  const mockPaginationData = {
    docs: mockPriceTables,
    pages: 17, // 97 total / 6 per page
    total: 97,
    limit: 6,
    page: _page,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tabela de Preços</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as tabelas de preços
          </p>
        </div>
        <Link href="/commercial/price-table/form/create">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Tabela
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de busca</CardTitle>
          <CardDescription>
            Preencha os filtros abaixo e clique em &quot;Pesquisar&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriceTableFilterForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Veja abaixo a lista de tabelas de preços encontradas com base nos
            filtros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriceTableTable currentPage={_page} data={mockPaginationData} />
        </CardContent>
      </Card>
    </div>
  );
}
