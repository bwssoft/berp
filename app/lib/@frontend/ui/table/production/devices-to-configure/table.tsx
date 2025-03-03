"use client";

import { columns } from "./columns";
import { DataTable } from "../../../component";
import { IConfigurationProfile } from "@/app/lib/@backend/domain";
import { ISerialPort } from "@/app/lib/@frontend/hook/use-serial-port";

interface Props {
  data: {
    imei?: string;
    iccid?: string;
    et?: string;
    port: ISerialPort;
    isIdentified: boolean;
    progress?: number;
    getDeviceProfile: (port: ISerialPort) => Promise<{
      profile: IConfigurationProfile["config"];
      native_profile: { cxip?: string; dns?: string; check?: string };
    } | void>;
    handleForgetPort: (port: ISerialPort) => Promise<void>;
  }[];
}
export function DevicesToConfigureTable(props: Props) {
  const { data } = props;
  return (
    <DataTable
      columns={columns}
      data={data}
      mobileDisplayValue={(data) => data.imei}
      mobileKeyExtractor={() => Math.random().toString()}
      className="w-full"
      //   theadClassName="[&_tr]:border-b bg-white border-b-1 border-b-gray-200"
    />
  );
}
