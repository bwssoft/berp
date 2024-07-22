export interface IFirebaseGateway {
  uploadFile(input: File, bucket: string): Promise<{
    url: string,
    bucket: string,
    name: string
  }>
  downloadFile(input: { name: string }, bucket: string): Promise<ArrayBuffer>
}