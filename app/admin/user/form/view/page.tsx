import { findManyProfile, findManyUser } from "@/app/lib/@backend/action";
import { ViewOneUserForm } from "@/app/lib/@frontend/ui/form";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const users = await findManyUser({...searchParams});
  const profiles = await findManyProfile({profile_id: users[0].profile_id});

  return (
    <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <div>
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                    Usuário
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                    Informações detalhadas sobre o usuário.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <ViewOneUserForm user={users[0]} profiles={profiles} />
            </div>
        </div>
    </div>
  );
}
