export interface IBMessageGateway {
    html(input: HtmlParams): Promise<void>
}
  
export interface HtmlParams {
    html: string 
    subject: string 
    attachments: Attachment[] 
    to: string 
}

export interface Attachment {
    filename: string 
    path?: string 
    content?: Buffer 
}