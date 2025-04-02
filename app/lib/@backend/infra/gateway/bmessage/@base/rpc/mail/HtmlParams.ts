// Original file: app/lib/@backend/infra/gateway/bmessage/@base/bmessage.proto

import type { Attachment as _mail_Attachment, Attachment__Output as _mail_Attachment__Output } from '../mail/Attachment';

export interface HtmlParams {
  'html'?: (string);
  'subject'?: (string);
  'attachments'?: (_mail_Attachment)[];
  'to'?: (string);
}

export interface HtmlParams__Output {
  'html': (string);
  'subject': (string);
  'attachments': (_mail_Attachment__Output)[];
  'to': (string);
}
