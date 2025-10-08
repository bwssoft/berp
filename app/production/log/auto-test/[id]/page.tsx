import { findOneAutoTestLog } from "@/app/lib/@backend/action/production/auto-test-log.action";
import { AutoTestLogDescription } from '@/frontend/ui/description/production/auto-test-log/auto-test-log.description';


interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const autoTestLog = await findOneAutoTestLog({ id });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <AutoTestLogDescription data={autoTestLog} />
      </div>
    </div>
  );
}
