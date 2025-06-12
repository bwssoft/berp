import { Button, TimelineItem } from "@/app/lib/@frontend/ui/component";
import { useCreateHistoricalForm } from "./use-create.historical.form";
import {
  FaceSmileIcon,
  PaperClipIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const timelineItems = [
  {
    author: "Chelsea Hagon",
    action: "Proposta (nº",
    link: { label: "123457", url: "#" },
    details: "enviada para aceite do cliente.",
    timestamp: "04/04/2025 09:00:05",
  },
  {
    author: "Chelsea Hagon",
    action: "Criação de Proposta (nº",
    link: { label: "123457", url: "#" },
    timestamp: "03/04/2025 15:20:14",
  },
  {
    author: "Sistema",
    action: "Rotina de atualização dos dados do CNPJ.",
    timestamp: "03/04/2025 15:14:46",
  },
  {
    author: "Chelsea Hagon",
    action: "📞 Gael Bernardo Lopes - Gerente - Celular (41) 98373-8269",
    details: `Em contato com Sr. Gael, solicitou o cancelamento da proposta atual para abertura de nova proposta adicionando mais 100 rastreadores.`,
    timestamp: "28/03/2025 14:02:56",
  },
  {
    author: "Chelsea Hagon",
    action: "📞 Gael Bernardo Lopes - Gerente - Celular (41) 98373-8269",
    details: `Em contato com Sr. Gael, solicitou o cancelamento da proposta atual para abertura de nova proposta adicionando mais 100 rastreadores.`,
    timestamp: "28/03/2025 14:02:56",
  },
  {
    author: "Chelsea Hagon",
    action: "📞 Gael Bernardo Lopes - Gerente - Celular (41) 98373-8269",
    details: `Em contato com Sr. Gael, solicitou o cancelamento da proposta atual para abertura de nova proposta adicionando mais 100 rastreadores.`,
    timestamp: "28/03/2025 14:02:56",
  },
  {
    author: "Alex Curren",
    action: "Criação de Proposta (nº",
    link: { label: "123456", url: "#" },
    timestamp: "02/03/2025 11:15:03",
  },
  {
    author: "Tom Cook",
    action: "Cadastro da conta",
    timestamp: "02/03/2025 10:05:26",
  },
];

export function CreateHistoricalForm() {
  const {} = useCreateHistoricalForm();
  return (
    <div className="w-[70%]">
      <form>
        <div className="border rounded-md p-4 mb-4 bg-white ">
          <textarea
            placeholder="Adicione seu histórico..."
            className="w-full resize-none border-none focus:outline-none focus:ring-0 focus:border-none p-0"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2 ">
            <div className="flex gap-3 ">
              <button title="Imagem" onClick={() => {}}>
                <PhoneIcon className="h-5 w-5" />
              </button>
              <button title="Emoji">
                <FaceSmileIcon className="h-5 w-5" />
              </button>
              <button title="Anexar">
                <PaperClipIcon className="h-5 w-5" />
              </button>
            </div>
            <Button variant={"outline"} type="submit">
              Salvar
            </Button>
          </div>
        </div>
      </form>
      <TimelineItem item={timelineItems} />
    </div>
  );
}
