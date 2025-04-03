import { findOneIdentificationLog } from "@/app/lib/@backend/action";
import { IdentificationLogDescription } from "@/app/lib/@frontend/ui/description";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;

  const autoTestLog = await findOneIdentificationLog({ id });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <IdentificationLogDescription data={autoTestLog} />
      </div>
    </div>
  );
}
