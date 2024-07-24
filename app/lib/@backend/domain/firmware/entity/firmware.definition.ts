export interface IFirmware {
  id: string
  name: string
  description: string
  version: string
  file: File
  created_at: Date
}

interface File {
  url: string
  bucket: string
  name: string
}