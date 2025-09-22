import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ServiceClient as _price_scheduler_ServiceClient, ServiceDefinition as _price_scheduler_ServiceDefinition } from './price_scheduler/Service';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  price_scheduler: {
    CancelInput: MessageTypeDefinition
    CancelResponse: MessageTypeDefinition
    PublishInput: MessageTypeDefinition
    PublishInputActionEnum: EnumTypeDefinition
    PublishResponse: MessageTypeDefinition
    Service: SubtypeConstructor<typeof grpc.Client, _price_scheduler_ServiceClient> & { service: _price_scheduler_ServiceDefinition }
  }
}

