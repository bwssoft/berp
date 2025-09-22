// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type { PublishInputActionEnum as _price_scheduler_PublishInputActionEnum, PublishInputActionEnum__Output as _price_scheduler_PublishInputActionEnum__Output } from '../price_scheduler/PublishInputActionEnum';

export interface CancelInput {
  'priceTableId'?: (string);
  'action'?: (_price_scheduler_PublishInputActionEnum);
}

export interface CancelInput__Output {
  'priceTableId': (string);
  'action': (_price_scheduler_PublishInputActionEnum__Output);
}
