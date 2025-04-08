import { Suspense } from "react";
import { LoginUserForm } from "../lib/@frontend/ui/form/admin/user/login/login.user.form";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg  p-3 md:h-36">
          <img className="h-8 w-auto" src="/bcube-logo.svg" alt="Bcube" />
        </div>
        <LoginUserForm />
      </div>
    </main>
  );
}
