import { findOneConfigurationProfile } from "@/backend/action/engineer/configuration-profile.action";
import { CheckConfigurationPanel } from "./@components/check-configuration-panel";
import { findOneTechnology } from "@/backend/action/engineer/technology.action";
import { findManyConfigurationLog } from "@/backend/action/production/configuration-log.action";

interface Props {
  searchParams: {
    configuration_profile_id?: string;
    configuration_log_id?: string[];
    technology_id?: string;
    auto_checking?: "false" | "true";
  };
}

export default async function Page(props: Props) {
  const date = new Date();

  const {
    searchParams: {
      configuration_profile_id,
      technology_id,
      configuration_log_id,
      auto_checking,
    },
  } = props;

  const [configurationProfile, technology, configurationLog] =
    await Promise.all([
      findOneConfigurationProfile({
        id: configuration_profile_id,
      }),
      findOneTechnology({
        id: technology_id,
      }),
      configuration_log_id
        ? findManyConfigurationLog({
            id: {
              $in: Array.isArray(configuration_log_id)
                ? configuration_log_id
                : [configuration_log_id],
            },
          })
        : [],
    ]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 ">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Checagem
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ferramenta para checar{" "}
            <span className="text-gray-900">dispositivos IoT.</span> Data de
            hoje:{" "}
            <time dateTime={date.toLocaleDateString()}>
              {date.toLocaleDateString()}
            </time>
          </p>
        </div>
      </div>
      <CheckConfigurationPanel
        configurationProfile={configurationProfile}
        configurationLog={configurationLog}
        technology={technology}
        autoChecking={auto_checking === "true"}
      />
    </div>
  );
}

