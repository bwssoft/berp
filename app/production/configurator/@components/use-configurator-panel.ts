import { IConfigurationProfile, ITechnology } from "@/app/lib/@backend/domain";
import {
  toast,
  useE34GCommunication,
  useWrongImeiDetector,
} from "@/app/lib/@frontend/hook";
import { useCountdown } from "@/app/lib/@frontend/hook/use-countdown";
import { useCallback, useState } from "react";

interface Props {
  configurationProfile: IConfigurationProfile | null;
  technology: ITechnology | null;
}
const COUNTDOWN_TIME_IN_SECONDS = 10;
export function useConfiguratorPanel(props: Props) {
  const { configurationProfile, technology } = props;

  const [isConfigurationDisabled, setIsConfigurationDisabled] = useState(true);
  const { count: configurationDisabledTimer, reset: resetTimer } = useCountdown(
    COUNTDOWN_TIME_IN_SECONDS,
    isConfigurationDisabled
  );

  const {
    configuration,
    identified,
    requestPort,
    handleDeviceConfiguration,
    getDeviceProfile,
    configurationLog,
    identifiedLog,
    ports,
    inIdentification,
    inConfiguration,
    handleForgetPort,
  } = useE34GCommunication({
    onDevicesIdentified: () => {
      resetTimer();
      setIsConfigurationDisabled(true);
      setTimeout(() => {
        setIsConfigurationDisabled(false);
      }, COUNTDOWN_TIME_IN_SECONDS * 1000);
    },
    onSerialConnected: () => {
      setIsConfigurationDisabled(true);
    },
    technology_id: technology?.id,
  });

  const { wrongImeiDetected, setWrongImeiDetected } = useWrongImeiDetector({
    state: identified,
    check: (el) => el?.imei?.startsWith("86"),
  });

  const handleConfigurationAction = useCallback(() => {
    const isInvalidConfiguration =
      !ports.length ||
      !configurationProfile ||
      Object.keys(configurationProfile ?? {}).length === 0;

    if (isInvalidConfiguration) {
      return toast({
        title: "Erro de Configuração",
        description:
          "Nenhuma porta está disponível ou o equipamento está desconectado. Verifique a conexão e tente novamente.",
        variant: "error",
        className:
          "destructive group border bg-red-500 border-red-400 text-white",
      });
    }

    handleDeviceConfiguration(identified, configurationProfile);
  }, [
    ports.length,
    configurationProfile,
    handleDeviceConfiguration,
    identified,
  ]);

  return {
    handleConfigurationAction,
    ports,
    identified,
    identifiedLog,
    inIdentification,
    getDeviceProfile,
    handleForgetPort,
    isConfigurationDisabled,
    configurationDisabledTimer,
    requestPort,
    wrongImeiDetected,
    setWrongImeiDetected,
    configurationLog,
    inConfiguration,
    configuration,
  };
}
