import { findOneTechnology } from "@/backend/action/engineer/technology.action";
import { IdentificatorPage } from "@/app/lib/@frontend/ui/page/production/tool/identificator/identificator.page";

interface Props {
  searchParams: {
    technology_id?: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { technology_id },
  } = props;

  const technology = await findOneTechnology({
    id: technology_id,
  });

  return <IdentificatorPage technology={technology} />;
}

