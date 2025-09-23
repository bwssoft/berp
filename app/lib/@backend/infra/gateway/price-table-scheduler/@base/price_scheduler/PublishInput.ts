// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type { PublishInputActionEnum as _price_scheduler_PublishInputActionEnum, PublishInputActionEnum__Output as _price_scheduler_PublishInputActionEnum__Output } from '../price_scheduler/PublishInputActionEnum';
import type { Long } from '@grpc/proto-loader';

export interface PublishInput {
  'priceTableId'?: (string);
  'deliver_at'?: (number | string | Long);
  'action'?: (_price_scheduler_PublishInputActionEnum);
}

export interface PublishInput__Output {
  'priceTableId': (string);
  'deliver_at': (number);
  'action': (_price_scheduler_PublishInputActionEnum__Output);
}
