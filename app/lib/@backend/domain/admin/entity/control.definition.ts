export interface IControl {
  id: string;
  name: string;
  description: string;
  code: string; // ex.: "module:admin:users:read"
  parent_code?: string; // Referência para o controle pai (null ou ausente se for de nível superior)
}
