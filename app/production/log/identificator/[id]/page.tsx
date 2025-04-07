import { findOneIdentificationLog } from "@/app/lib/@backend/action";
import { IdentificationLogDescription } from "@/app/lib/@frontend/ui/description";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const autoTestLog = await findOneIdentificationLog({ id });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <IdentificationLogDescription data={autoTestLog} />
      </div>
    </div>
  );
}
