export interface ICommand {
  id: string
  name: string
  data: string
  description: string
  variables?: Record<string, string>
  created_at: Date
}