export interface IUser {
  id: string;
  username: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  temporary_password: boolean;
  profile_id: string[];
  lock: boolean;
  active: boolean;
  image?: string | null;
  external: boolean;
  created_at: Date;
}
