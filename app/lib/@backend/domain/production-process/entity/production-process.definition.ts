export interface IProductionProcess {
  id: string;
  name: string;
  steps: Array<IProductionProcessStep>;
  attachments?: Array<IProductionProcessAttachment>;
  created_at: Date;
}

export interface IProductionProcessStep {
  id: string;
  label: string;
}

export interface IProductionProcessAttachment {
  id: string;
  name: string;
  url: string;
  extension: string;
}
