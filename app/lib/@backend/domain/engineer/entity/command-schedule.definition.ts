export interface ISchedule {
  id: string
  command_id: string
  data: string
  pending: boolean
  device_id: string
  firmware_id?: string
  request_timestamp?: number
  created_at: Date
}