import { singleton } from "@/app/lib/util";
import { config } from "@/app/lib/config";
import type { CancelPriceTableSchedulePayload } from "@/backend/domain/commercial/entity/price-table.definition";

export interface ScheduleResponse {
  message: string;
  startScheduleId: string;
  startDateTime: string;
  startScheduleArn?: string;
  endScheduleId?: string;
  endDateTime?: string;
  endScheduleArn?: string;
}

export class PriceTableSchedulerGateway {
  private readonly baseUrl = config.PRICE_TABLE_SCHEDULER_API_URL;

  async createSchedules({
    priceTableId,
    startDateTime,
    endDateTime,
  }: {
    priceTableId: string;
    startDateTime: string;
    endDateTime?: string;
  }): Promise<ScheduleResponse> {
    let body;

    if (!endDateTime) {
      body = { priceTableId, startDateTime };
    } else {
      body = { priceTableId, startDateTime, endDateTime };
    }

    const response = await fetch(`${this.baseUrl}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok)
      throw new Error(`Failed to create schedules: ${response.status}`);

    return response.json();
  }

  async deleteSchedule({
    scheduleId,
  }: CancelPriceTableSchedulePayload): Promise<void> {
    const response = await fetch(`${this.baseUrl}/schedule/${scheduleId}`, {
      method: "DELETE",
    });
    if (response.status === 404) throw new Error("Not Found");
    if (!response.ok)
      throw new Error(`Failed to delete schedule: ${response.status}`);
  }

  async getSchedule(scheduleId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/schedule/${scheduleId}`);
    if (response.status === 404) throw new Error("Not Found");
    if (!response.ok)
      throw new Error(`Failed to get schedule: ${response.status}`);
    return response.json();
  }
}

export const priceTableSchedulerGateway = singleton(PriceTableSchedulerGateway);
