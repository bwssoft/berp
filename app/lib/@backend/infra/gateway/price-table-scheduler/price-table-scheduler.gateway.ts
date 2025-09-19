import { singleton } from "@/app/lib/util";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import fs from "fs";
import {
  IPriceTableSchedulerGateway,
  PublishInput,
  PublishInputActionEnum,
  CancelScheduleParams,
} from "../../../domain/@shared/gateway/price-table-scheduler.gateway.interface";
import { ProtoGrpcType } from "./@base/price-table-scheduler";
import { SchedulerServiceClient } from "./@base/scheduler/SchedulerService";

const PROTO_PATH = path.join(
  process.cwd(),
  "./app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto"
);
const CRT_PATH = path.join(
  process.cwd(),
  "./app/lib/@backend/infra/gateway/price-table-scheduler/@base/ca.crt"
);

// Load proto definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const PriceTableSchedulerService = proto.scheduler.SchedulerService;

class PriceTableSchedulerGateway implements IPriceTableSchedulerGateway {
  private client: SchedulerServiceClient;

  constructor() {
    this.client = new PriceTableSchedulerService(
      process.env.PRICE_TABLE_SCHEDULER_GRPC_URL!,
      grpc.credentials.createSsl(fs.readFileSync(CRT_PATH))
    );
  }

  async publish(input: PublishInput): Promise<void> {
    const { priceTableId, deliver_at, action } = input;

    const deliveryDate = new Date(deliver_at);
    const actionName =
      action === PublishInputActionEnum.start ? "activation" : "inactivation";

    console.log(
      `Scheduling ${actionName} for price table ${priceTableId} at ${deliveryDate}`
    );

    try {
      // gRPC call implementation
      await this.schedulePublish(input);

      console.info(
        `✅ Price table ${actionName} scheduled successfully for ${priceTableId}`
      );
    } catch (error) {
      console.error(`❌ Error scheduling price table ${actionName}:`, error);
      throw new Error(`Failed to schedule price table ${actionName}`);
    }
  }

  async cancelSchedule(input: CancelScheduleParams): Promise<void> {
    const { priceTableId, action } = input;

    const actionName =
      action === PublishInputActionEnum.start ? "activation" : "inactivation";
    console.log(
      `Cancelling ${actionName} schedule for price table ${priceTableId}`
    );

    try {
      // gRPC call implementation
      await this.cancelPublish(input);

      console.info(
        `✅ ${actionName} schedule cancelled successfully for ${priceTableId}`
      );
    } catch (error) {
      console.error("❌ Error cancelling schedule:", error);
      throw new Error("Failed to cancel schedule");
    }
  }

  private async schedulePublish(input: PublishInput): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(input, (err: grpc.ServiceError | null) => {
        if (err) {
          console.error("gRPC error:", err);
          return reject(new Error("Failed to schedule via gRPC"));
        }
        console.info("Schedule request sent successfully via gRPC!");
        resolve();
      });
    });
  }

  private async cancelPublish(input: CancelScheduleParams): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.cancel(input, (err: grpc.ServiceError | null) => {
        if (err) {
          console.error("gRPC error:", err);
          return reject(new Error("Failed to cancel schedule via gRPC"));
        }
        console.info("Cancel request sent successfully via gRPC!");
        resolve();
      });
    });
  }
}

export const priceTableSchedulerGateway = singleton(PriceTableSchedulerGateway);
