// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelInput as _scheduler_CancelInput, CancelInput__Output as _scheduler_CancelInput__Output } from '../scheduler/CancelInput';
import type { CancelResponse as _scheduler_CancelResponse, CancelResponse__Output as _scheduler_CancelResponse__Output } from '../scheduler/CancelResponse';
import type { PublishInput as _scheduler_PublishInput, PublishInput__Output as _scheduler_PublishInput__Output } from '../scheduler/PublishInput';
import type { PublishResponse as _scheduler_PublishResponse, PublishResponse__Output as _scheduler_PublishResponse__Output } from '../scheduler/PublishResponse';

export interface SchedulerServiceClient extends grpc.Client {
  Cancel(argument: _scheduler_CancelInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _scheduler_CancelInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _scheduler_CancelInput, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  Cancel(argument: _scheduler_CancelInput, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _scheduler_CancelInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _scheduler_CancelInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _scheduler_CancelInput, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _scheduler_CancelInput, callback: grpc.requestCallback<_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  
  Publish(argument: _scheduler_PublishInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  Publish(argument: _scheduler_PublishInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  Publish(argument: _scheduler_PublishInput, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  Publish(argument: _scheduler_PublishInput, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _scheduler_PublishInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _scheduler_PublishInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _scheduler_PublishInput, options: grpc.CallOptions, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _scheduler_PublishInput, callback: grpc.requestCallback<_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface SchedulerServiceHandlers extends grpc.UntypedServiceImplementation {
  Cancel: grpc.handleUnaryCall<_scheduler_CancelInput__Output, _scheduler_CancelResponse>;
  
  Publish: grpc.handleUnaryCall<_scheduler_PublishInput__Output, _scheduler_PublishResponse>;
  
}

export interface SchedulerServiceDefinition extends grpc.ServiceDefinition {
  Cancel: MethodDefinition<_scheduler_CancelInput, _scheduler_CancelResponse, _scheduler_CancelInput__Output, _scheduler_CancelResponse__Output>
  Publish: MethodDefinition<_scheduler_PublishInput, _scheduler_PublishResponse, _scheduler_PublishInput__Output, _scheduler_PublishResponse__Output>
}
