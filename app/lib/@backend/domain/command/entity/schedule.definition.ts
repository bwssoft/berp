export interface ISchedule {
  device_id: string
  command_id: string
  pending: boolean
  request_timestamp?: number
  response_timestamp?: number
}