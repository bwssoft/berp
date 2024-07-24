export interface ICommand {
  id: string
  name: string
  data: string
  description: string
  firmware_id?: string
  created_at: Date
}