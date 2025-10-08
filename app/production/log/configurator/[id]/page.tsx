import { findOneConfigurationLog } from "@/app/lib/@backend/action/production/configuration-log.action";
import { ConfigurationLogDescription } from '@/frontend/ui/description/production/configuration-log/configuration-log.description';


interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const autoTestLog = await findOneConfigurationLog({ id });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationLogDescription data={autoTestLog} />
      </div>
    </div>
  );
}
