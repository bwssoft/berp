// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

export const PublishInputActionEnum = {
  UNKNOWN: 'UNKNOWN',
  start: 'start',
  end: 'end',
} as const;

export type PublishInputActionEnum =
  | 'UNKNOWN'
  | 0
  | 'start'
  | 1
  | 'end'
  | 2

export type PublishInputActionEnum__Output = typeof PublishInputActionEnum[keyof typeof PublishInputActionEnum]
