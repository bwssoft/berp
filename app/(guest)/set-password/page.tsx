import { SetNewPasswordUserForm } from "@/app/lib/@frontend/ui/form";

interface Props {
  searchParams: {
    id: string;
  };
}
export default function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/bcube-logo.svg"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Crie sua nova senha
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SetNewPasswordUserForm userId={id} />
      </div>
    </div>
  );
}
