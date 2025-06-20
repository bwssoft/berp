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
  description?: string;
  created_at: Date;
  type?: 'proposta' | 'sistema' | 'ligacao' | 'cadastro' | 'observacao';
}
