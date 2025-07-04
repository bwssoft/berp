import { IUser } from "../../admin";

export interface IAccountAttachment {
  id: string;
  name: string;
  user: Pick<IUser, "id" | "name">;
  createdAt: Date;
  file?: File;
  accountId: string;
}
