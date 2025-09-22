export interface IPriceTableSchedulerGateway {
  publish(input: PublishInput): Promise<void>;
  cancelSchedule(input: CancelScheduleParams): Promise<void>;
}

export interface PublishInput {
  priceTableId: string;
  deliver_at: number; // Unix timestamp in milliseconds
  action: PublishInputActionEnum;
}

export enum PublishInputActionEnum {
  UNKNOWN = 0,
  start = 1,
  end = 2,
}

export interface CancelScheduleParams {
  priceTableId: string;
  action: PublishInputActionEnum;
}
