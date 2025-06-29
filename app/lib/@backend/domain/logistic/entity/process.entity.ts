// https://v0.dev/chat/react-form-example-WkB0CZNScDs
export interface IProcess {
  id: string;
  seq: number;
  name: string;
  description?: string;
  steps: Process.Step[];
  created_at: Date;
  updated_at?: Date;
}

export namespace Process {
  export interface Step {
    order: number; // Ordem da etapa no processo
    base: Base; // Base onde ocorrem as movimentações
    entrie: string[];
    output: string[];
  }

  export interface Base {
    id: string;
    sku: string;
  }
}
