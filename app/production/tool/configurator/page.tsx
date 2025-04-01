import {
  findOneConfigurationProfile,
  findOneTechnology,
} from "@/app/lib/@backend/action";
import { ConfiguratorPanel } from "./@components/configurator-panel";

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
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 ">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Configurador
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ferramenta para configurar
            <a href="#" className="text-gray-900">
              dispositivos IoT.
            </a>{" "}
            Data de hoje:{" "}
            <time dateTime={date.toLocaleDateString()}>
              {date.toLocaleDateString()}
            </time>
          </p>
        </div>
      </div>
      <ConfiguratorPanel
        configurationProfile={configurationProfile}
        technology={technology}
      />
    </div>
  );
}
