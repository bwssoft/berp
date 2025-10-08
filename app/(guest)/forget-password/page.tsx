import { RequestNewPasswordUserForm } from '@/frontend/ui/form/admin/user/request-new-password/request-new-password.user.form';


export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="/bcube-logo.svg"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Esqueceu sua senha?
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RequestNewPasswordUserForm />
      </div>
    </div>
  );
}
