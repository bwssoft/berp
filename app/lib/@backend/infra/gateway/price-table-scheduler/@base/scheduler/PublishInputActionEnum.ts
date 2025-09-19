// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

export const PublishInputActionEnum = {
  UNKNOWN: 0,
  start: 1,
  end: 2,
} as const;

export type PublishInputActionEnum =
  | 'UNKNOWN'
  | 0
  | 'start'
  | 1
  | 'end'
  | 2

export type PublishInputActionEnum__Output = typeof PublishInputActionEnum[keyof typeof PublishInputActionEnum]
