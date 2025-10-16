"use client";

import { useEffect, useMemo, useState } from "react";
import { Device } from "@/backend/domain/engineer/entity/device.definition";
import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import { IConfigurationProfile } from "@/backend/domain/engineer/entity/configuration-profile.definition";
import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import { diffObjects } from "../../util/get-object-diff";
import { updateBulkConfigurationLog } from "../../@backend/action/production/configuration-log.action";
namespace Namespace {
  export interface UseConfigurationProps {
    technology: ITechnology | null;
    client?: IClient | null;
    configurationProfile?: IConfigurationProfile | null;
    configurationLog?: IConfigurationLog[] | null;
    autoChecking?: boolean;
  }

  export interface Detected {
    port: ISerialPort;
    equipment?: Equipment | undefined;
    status: "fully_identified" | "partially_identified" | "not_identified";
  }

  interface Equipment {
    imei?: string | undefined;
    iccid?: string | undefined;
    firmware?: string | undefined;
    serial?: string | undefined;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  }

  export interface Checked {
    checked: boolean;
    checked_at: Date;
    port: ISerialPort;
    equipment: Required<Pick<Equipment, "serial" | "firmware">> & Equipment;
    config: IConfigurationProfile["config"];
    configurationProfileId?: string;
    configurationLogId?: string;
  }
}

export const useCheckConfiguration = (
  props: Namespace.UseConfigurationProps
) => {
  const { technology, configurationProfile, configurationLog, autoChecking } =
    props;

  const [detected, setDetected] = useState<Namespace.Detected[]>([]);
  const detectedKey = useMemo(() => {
    return detected
      .map((d) => d.equipment?.serial ?? "")
      .filter((s) => s.length > 0)
      .sort()
      .join("|");
  }, [detected]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const [checked, setChecked] = useState<Namespace.Checked[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const [autoCheckingEnabled, setAutoCheckingEnabled] = useState<boolean>(
    autoChecking ?? false
  );

  const toggleAutoChecking = (checked: boolean) =>
    setAutoCheckingEnabled(checked);

  // hook that handle interactions with devicess
  const { ports, handleDetection, handleGetConfig, requestPort, isIdentified } =
    useTechnology(technology);

  // function that handle the check process, check if the process was successful and save result on database
  const check = async (
    detected: Namespace.Detected[],
    configurationProfile?: IConfigurationProfile | null,
    configurationLog?: IConfigurationLog[] | null
  ) => {
    setIsChecking(true);

    try {
      // 1) Filtrar apenas dispositivos com serial e firmware válidos
      const validDevices = detected.filter(
        (
          d
        ): d is typeof d & {
          equipment: { serial: string; firmware: string };
        } => Boolean(d.equipment?.serial && d.equipment?.firmware)
      );

      // 2) Puxar configuração atual de todos eles
      const results = await handleGetConfig(validDevices);

      // 3) Iterar, calcular checks e montar operações de bulk-update
      const bulkOps: Array<{
        query: { id: string };
        value: Partial<
          Pick<
            IConfigurationLog,
            | "equipment"
            | "checked"
            | "checked_at"
            | "applied_profile"
            | "desired_profile"
            | "id"
            | "technology"
            | "user"
            | "status"
            | "created_at"
          >
        >;
      }> = [];

      const finalLogs = results.map(({ port, equipment, config, messages }) => {
        const now = new Date();
        let checked = false;
        let configurationLogId: string | undefined;
        let configurationProfileId: string | undefined;

        // a) Se veio um configurationProfile, comparar com ele
        if (configurationProfile) {
          const diffs = [
            ...diffObjects({
              desired: configurationProfile.config.general ?? {},
              // @ts-expect-error MOTIVO: Rapaz, gerei algum problema de tipagem aqui. Resolver depois TODO
              applied: config.general ?? {},
              keySelection: "desired",
            }),
            ...diffObjects({
              desired: configurationProfile.config.specific ?? {},
              // @ts-expect-error MOTIVO: Rapaz, gerei algum problema de tipagem aqui. Resolver depois TODO
              applied: config.specific ?? {},
              keySelection: "desired",
            }),
          ];
          checked = diffs.length === 0;
          configurationProfileId = configurationProfile.id;
          const logId = crypto.randomUUID();
          bulkOps.push({
            query: { id: logId },
            value: {
              equipment,
              checked,
              checked_at: now,
              desired_profile: {
                id: configurationProfile.id,
                name: configurationProfile.name,
                config: configurationProfile.config,
              },
              applied_profile: config,
              id: logId,
              technology: {
                id: technology!.id,
                system_name: technology!.name.system,
              },
              status: true,
              created_at: new Date(),
            },
          });

          // b) Senão, se vier um configurationLog, tentar encontrar o log existente
        } else if (configurationLog) {
          const existing = configurationLog.find(
            (l) => l.equipment.serial === equipment.serial
          );
          if (existing) {
            const diffs = [
              ...diffObjects({
                desired: existing?.applied_profile?.general ?? {},
                // @ts-expect-error MOTIVO: Rapaz, gerei algum problema de tipagem aqui. Resolver depois TODO
                applied: config.general ?? {},
                keySelection: "desired",
              }),
              ...diffObjects({
                desired: existing?.applied_profile?.specific ?? {},
                // @ts-expect-error MOTIVO: Rapaz, gerei algum problema de tipagem aqui. Resolver depois TODO
                applied: config.specific ?? {},
                keySelection: "desired",
              }),
            ];
            checked = diffs.length === 0;
            configurationLogId = existing.id;
            bulkOps.push({
              query: { id: configurationLogId },
              value: {
                equipment,
                checked,
                checked_at: now,
                applied_profile: config,
              },
            });
          }
        }

        // d) Retorna o objeto final para setChecked
        return {
          port,
          equipment,
          messages,
          config,
          checked,
          checked_at: now,
          configurationLogId,
          configurationProfileId,
        };
      });

      // 4) Executa o bulk update e atualiza o state
      if (bulkOps.length) {
        const res = await fetch(
          "/api/production/configuration-log/update-bulk",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bulkOps),
          }
        );
        if (!res.ok) throw new Error("Erro ao salvar os logs");
      }
      setChecked((prev) => [...prev, ...finalLogs]);
    } catch (error) {
      console.error("[ERROR] check use-configuration", error);
    } finally {
      setIsChecking(false);
    }
  };

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isChecking) return;

      if (!isDetecting && ports.length) {
        setIsDetecting(true);
        const detected = (await handleDetection(ports)).filter(
          (d) => d.response && d.response.serial
        );

        setDetected(() => {
          const map = new Map();

          for (const { port, response } of detected) {
            map.set(response!.serial, {
              port,
              equipment: response,
              status: !response ? "not_identified" : isIdentified(response),
            });
          }

          return Array.from(new Set(map.values()));
        });

        setIsDetecting(false);
      } else if (!isDetecting && !ports.length) {
        setDetected([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ports, handleDetection, isChecking, isDetecting]);

  useEffect(() => {
    (async () => {
      if (detectedKey.length > 0 && autoCheckingEnabled) {
        await check(detected, configurationProfile, configurationLog);
      }
    })();
  }, [
    detectedKey,
    configurationProfile,
    configurationLog,
    autoCheckingEnabled,
  ]);

  return {
    checked,
    detected,
    check,
    requestPort,
    isChecking,
    isDetecting,
    toggleAutoChecking,
    autoCheckingEnabled,
  };
};
