import { IUser } from "@/backend/domain/admin/entity/user.definition";

export interface IAccountAttachment {
  id: string;
  name: string;
  user: Pick<IUser, "id" | "name">;
  createdAt: Date;
  file?: File;
  accountId: string;
}

export default IAccountAttachment;
