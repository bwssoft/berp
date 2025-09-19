import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { SchedulerServiceClient as _scheduler_SchedulerServiceClient, SchedulerServiceDefinition as _scheduler_SchedulerServiceDefinition } from './scheduler/SchedulerService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  scheduler: {
    CancelInput: MessageTypeDefinition
    CancelResponse: MessageTypeDefinition
    PublishInput: MessageTypeDefinition
    PublishInputActionEnum: EnumTypeDefinition
    PublishResponse: MessageTypeDefinition
    SchedulerService: SubtypeConstructor<typeof grpc.Client, _scheduler_SchedulerServiceClient> & { service: _scheduler_SchedulerServiceDefinition }
  }
}

