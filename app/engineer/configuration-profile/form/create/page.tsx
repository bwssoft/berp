import { findManyClient } from "@/app/lib/@backend/action/commercial/client.action";
import { findManyTechnology } from "@/app/lib/@backend/action/engineer/technology.action";
import { ConfigurationProfileUpsertForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  const [clients, technologies] = await Promise.all([
    findManyClient({}),
    findManyTechnology({}),
  ]);
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Novo Perfil de Configuração
          </h1>
          <p className="text-muted-foreground">
            Configure um novo perfil para equipamentos IoT
          </p>
        </div>
        <ConfigurationProfileUpsertForm
          clients={clients}
          technologies={technologies}
        />
      </div>
    </div>
  );
}
