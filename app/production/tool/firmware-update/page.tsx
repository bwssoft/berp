import { findOneTechnology } from "@/backend/action/engineer/technology.action";
import { FirmwareUpdatePage } from "@/app/lib/@frontend/ui/page/production/tool/firmware-update/firmware-update.page";

interface Props {
  searchParams: {
    technology_id?: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { technology_id },
  } = props;

  const [technology] = await Promise.all([
    findOneTechnology({
      id: technology_id,
    }),
  ]);

  return <FirmwareUpdatePage technology={technology} />;
}

