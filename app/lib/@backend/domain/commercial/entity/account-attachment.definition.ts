export interface IAccountAttachment {
  id: string;
  name: string;
  userId?: string;
  createdAt: Date;
  file?: File;
  accountId: string;
}
