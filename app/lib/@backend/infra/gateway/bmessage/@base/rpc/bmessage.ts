import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { MailServiceClient as _mail_MailServiceClient, MailServiceDefinition as _mail_MailServiceDefinition } from './mail/MailService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
    }
  }
  mail: {
    Attachment: MessageTypeDefinition
    HtmlParams: MessageTypeDefinition
    MailService: SubtypeConstructor<typeof grpc.Client, _mail_MailServiceClient> & { service: _mail_MailServiceDefinition }
  }
}

