/**
 * Gets the content type (MIME type) based on the file extension
 * @param fileName The name of the file including the extension
 * @returns The content type string
 */
export function getContentTypeFromFileName(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    case "html":
    case "htm":
      return "text/html";
    case "js":
      return "text/javascript";
    case "css":
      return "text/css";
    case "xml":
      return "application/xml";
    case "zip":
      return "application/zip";
    case "rar":
      return "application/x-rar-compressed";
    case "7z":
      return "application/x-7z-compressed";
    case "mp3":
      return "audio/mpeg";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    default:
      return "application/octet-stream"; // Default binary file
  }
}
