import { E34G, NB2 } from "../../../infra/protocol";
import { IDeviceLog } from "./device-log.definition";

export interface IAutoTestLog extends IDeviceLog {
  analysis: Analysis;
}

type Analysis = {
  [K in keyof NB2.AutoTest | keyof E34G.AutoTest]?: boolean;
};
