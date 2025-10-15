import { E34G } from "@/backend/infra/protocol/parser/E34G";
import { BwsNb2 } from "@/backend/infra/protocol/parser/nb-2";
import { IDeviceLog } from "./device-log.definition";

export interface IAutoTestLog extends IDeviceLog {
  analysis: Analysis;
}

type Analysis = {
  [K in keyof BwsNb2.AutoTest | keyof E34G.AutoTest]?: boolean;
};
