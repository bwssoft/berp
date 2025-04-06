import { IUser } from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { Checkbox, Input, Select } from "../../../../component";
import { useViewOneUserForm } from "./use-view-one.user.form";
import { IProfile } from "@/app/lib/@backend/domain";

type Props = {
  user: IUser;
  profiles: IProfile[]
};

export function ViewOneUserForm({ user, profiles }: Props) {
    const {} = useViewOneUserForm(user)

  return (
    <form className="mt-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox disabled label="Ativo" checked={user.active} />

            <Input label="CPF" value={user.cpf} disabled />
            <Input label="Nome completo" value={user.name} disabled />
            <Input label="Email" value={user.email} disabled />
            <Input label="Usuário" value={user.username} disabled />

            <div className="md:col-span-2">
            <Select
                label="Perfis"
                name="profiles"
                data={profiles}
                value={profiles.find((p) => user.profile_id.includes(p.id))}
                keyExtractor={(item) => item.id}
                valueExtractor={(item) => item.name}
            />
            </div>
            {/* adicionar input pra upload de foto */}
        </div>
    </form>

  );
}
