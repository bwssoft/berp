// Original file: app/lib/@backend/infra/gateway/bmessage/@base/bmessage.proto


export interface Attachment {
  'filename'?: (string);
  'path'?: (string);
  'content'?: (Buffer | Uint8Array | string);
  '_path'?: "path";
  '_content'?: "content";
}

export interface Attachment__Output {
  'filename': (string);
  'path'?: (string);
  'content'?: (Buffer);
  '_path': "path";
  '_content': "content";
}
