// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type { PublishInputActionEnum as _scheduler_PublishInputActionEnum, PublishInputActionEnum__Output as _scheduler_PublishInputActionEnum__Output } from '../scheduler/PublishInputActionEnum';
import type { Long } from '@grpc/proto-loader';

export interface PublishInput {
  'priceTableId'?: (string);
  'deliverAt'?: (number | string | Long);
  'action'?: (_scheduler_PublishInputActionEnum);
}

export interface PublishInput__Output {
  'priceTableId'?: (string);
  'deliverAt'?: (Long);
  'action'?: (_scheduler_PublishInputActionEnum__Output);
}
