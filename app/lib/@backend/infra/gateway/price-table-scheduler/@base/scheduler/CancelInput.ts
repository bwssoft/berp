// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type { PublishInputActionEnum as _scheduler_PublishInputActionEnum, PublishInputActionEnum__Output as _scheduler_PublishInputActionEnum__Output } from '../scheduler/PublishInputActionEnum';

export interface CancelInput {
  'priceTableId'?: (string);
  'action'?: (_scheduler_PublishInputActionEnum);
}

export interface CancelInput__Output {
  'priceTableId'?: (string);
  'action'?: (_scheduler_PublishInputActionEnum__Output);
}
