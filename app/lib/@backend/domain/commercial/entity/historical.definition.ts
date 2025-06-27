export interface IHistorical {
  id: string;
  accountId: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  action?: string; // exemplo: "Proposta (nº" 83787584758) igual jaisson deixou de exemplo
  file?: {
    name?: string,
    url?: string,
    id?: string
  }
  contacts?: ContactSelection
  description?: string;
  title: string; // exemplo de acordo com o protótipo do jaisson: "Criação de Proposta"
  created_at: Date;
  type?: 'proposta' | 'sistema'  | "manual" | "conta";
}

export type ContactSelection = {
  id: string;
  name: string;
  type: string;
  contact: string;
  channel: string
};