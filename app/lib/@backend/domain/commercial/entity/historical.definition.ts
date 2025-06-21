export interface IHistorical {
  id: string;
  accountId: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
  action?: string; // exemplo: "Proposta (nº" 83787584758) igual jaisson deixou de exemplo
  link?: {
    label: string;
    url: string;
  };
  contacts: ContactSelection[]
  description?: string;
  title: string; // exemplo de acordo com o protótipo do jaisson: "Criação de Proposta"
  created_at: Date;
  type?: 'proposta' | 'sistema' | 'ligacao' | 'cadastro' | 'observacao' | "anexo";
}

export type ContactSelection = {
  id: string;
  name: string;
  type: string;
  contact: string;
};