import { useCallback, useEffect, useRef, useState } from "react";
import { useE34G } from "./use-E34G";
import { IConfigurationProfile, ITechnology } from "../../@backend/domain";
import { toast } from "./use-toast";
import { checkWithDifference, typedObjectEntries } from "../../util";

namespace Namespace {
  export interface UseConfigurationProps {
    technology: ITechnology | null;
  }

  export interface Identified {
    imei: string | undefined;
    iccid: string | undefined;
    et: string | undefined;
  }

  export interface Configuration {
    imei: string;
    configured: boolean;
    configuration_profile_log_id: string;
  }
}

export const useConfiguration = (props: Namespace.UseConfigurationProps) => {
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const inIdentificationProcess = useRef(false);

  const [configured, setConfigured] = useState<Namespace.Configuration[]>([]);
  const inConfigurationProcess = useRef(false);

  // hook that handle interactions with E34G devices
  const {
    ports,
    handleIdentificationProcess,
    handleConfigurationProcess,
    handleGetProfile,
  } = useE34G();

  // function that handle with configuration process, check if the process was successful and save result on database
  const handleConfiguration = useCallback(
    async (configuration_profile: IConfigurationProfile | null) => {
      if (configuration_profile === null) {
        toast({
          variant: "error",
          title: "Erro!",
          description: "Selecione um perfil de configuração",
        });
        return;
      }

      inConfigurationProcess.current = true;

      // configure devices
      const configurationResult = await handleConfigurationProcess(
        ports,
        configuration_profile
      );

      // obtain device profile after configuration process
      const profilesAfterConfiguration = await handleGetProfile(ports);

      // check if each profile is the desired profile
      delete configuration_profile.config?.password;
      profilesAfterConfiguration.forEach((profile) => {
        const { isEqual, difference } = checkWithDifference(
          configuration_profile.config,
          profile
        );
      });

      // check if each message sent has response
      configurationResult.forEach((result) => {
        if (!result) return;
        Object.entries(result).every(
          ([key, value]) => typeof value !== "undefined"
        );
      });

      // save result on database
      // createManyConfigurationProfileLog()

      // update state with configuration process result
      // setConfiguration(some data)

      inConfigurationProcess.current = false;
    },
    [ports]
  );

  // useEffect used to identify devices when connected to serial ports
  useEffect(() => {
    (async () => {
      if (!inIdentificationProcess.current && ports.length) {
        inIdentificationProcess.current = true;
        const identified = await handleIdentificationProcess(ports);
        setIdentified((prev) => [
          ...prev,
          ...identified.filter((item) => item !== undefined),
        ]);
        inIdentificationProcess.current = false;
      }
    })();
  }, [ports]);

  return {
    identified,
    handleConfiguration,
  };
};
