export interface IUser {
  id: string;
  username: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  temporary_password: boolean;
  profile: { id: string; name: string }[];
  lock: boolean;
  active: boolean;
  image?: {
    key: string;
  };
  external: boolean;
  created_at: Date;
}

export default IUser;
