export interface IUser {
    id: string;
    username: string;
    name: string;
    cpf: string;
    email: string;
    password: string;
    password_request_token?: string | null;
    profile_id: string[];
    lock: boolean;
    active: boolean;
    image: string;
    external: boolean
    created_at: Date;
}
