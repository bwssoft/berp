import { findOneConfigurationProfile } from "@/backend/action/engineer/configuration-profile.action";
import { findOneTechnology } from "@/backend/action/engineer/technology.action";
import { ConfiguratorPage } from "@/app/lib/@frontend/ui/page/production/tool/configurator/configurator.page";

interface Props {
  searchParams: {
    configuration_profile_id?: string;
    technology_id?: string;
  };
}

export default async function Page(props: Props) {
  const date = new Date();

  const {
    searchParams: { configuration_profile_id, technology_id },
  } = props;

  const [configurationProfile, technology] = await Promise.all([
    findOneConfigurationProfile({
      id: configuration_profile_id,
    }),
    findOneTechnology({
      id: technology_id,
    }),
  ]);

  return (
    <ConfiguratorPage
      configurationProfile={configurationProfile}
      technology={technology}
    />
  );
}

