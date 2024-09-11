export interface IProductionProcess {
  id: string;
  name: string;
  description?: string;
  steps: Array<IProductionProcessStep>;
  attachments?: Array<IProductionProcessAttachment>;
  created_at: Date;
}

export interface IProductionProcessStep {
  id: string;
  label: string;
  checked: boolean;
}

export interface IProductionProcessAttachment {
  id: string;
  name: string;
  url: string;
  extension: string;
}
