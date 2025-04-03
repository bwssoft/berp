import { findManyClient, findManyTechnology } from "@/app/lib/@backend/action";
import { ConfigurationProfileCreateForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  const [clients, technologies] = await Promise.all([
    findManyClient({}),
    findManyTechnology({}),
  ]);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationProfileCreateForm
          clients={clients}
          technologies={technologies}
        />
      </div>
    </div>
  );
}
