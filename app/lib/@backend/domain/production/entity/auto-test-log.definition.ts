import { E34G, BwsNb2 } from "../../../infra/protocol";
import { IDeviceLog } from "./device-log.definition";

export interface IAutoTestLog extends IDeviceLog {
  analysis: Analysis;
}

type Analysis = {
  [K in keyof BwsNb2.AutoTest | keyof E34G.AutoTest]?: boolean;
};
