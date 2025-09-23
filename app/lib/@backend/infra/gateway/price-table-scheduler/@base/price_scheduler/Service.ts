// Original file: app/lib/@backend/infra/gateway/price-table-scheduler/@base/price-table-scheduler.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelInput as _price_scheduler_CancelInput, CancelInput__Output as _price_scheduler_CancelInput__Output } from '../price_scheduler/CancelInput';
import type { CancelResponse as _price_scheduler_CancelResponse, CancelResponse__Output as _price_scheduler_CancelResponse__Output } from '../price_scheduler/CancelResponse';
import type { PublishInput as _price_scheduler_PublishInput, PublishInput__Output as _price_scheduler_PublishInput__Output } from '../price_scheduler/PublishInput';
import type { PublishResponse as _price_scheduler_PublishResponse, PublishResponse__Output as _price_scheduler_PublishResponse__Output } from '../price_scheduler/PublishResponse';

export interface ServiceClient extends grpc.Client {
  cancel(argument: _price_scheduler_CancelInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_price_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _price_scheduler_CancelInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_price_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _price_scheduler_CancelInput, options: grpc.CallOptions, callback: grpc.requestCallback<_price_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  cancel(argument: _price_scheduler_CancelInput, callback: grpc.requestCallback<_price_scheduler_CancelResponse__Output>): grpc.ClientUnaryCall;
  
  publish(argument: _price_scheduler_PublishInput, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_price_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _price_scheduler_PublishInput, metadata: grpc.Metadata, callback: grpc.requestCallback<_price_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _price_scheduler_PublishInput, options: grpc.CallOptions, callback: grpc.requestCallback<_price_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  publish(argument: _price_scheduler_PublishInput, callback: grpc.requestCallback<_price_scheduler_PublishResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ServiceHandlers extends grpc.UntypedServiceImplementation {
  cancel: grpc.handleUnaryCall<_price_scheduler_CancelInput__Output, _price_scheduler_CancelResponse>;
  
  publish: grpc.handleUnaryCall<_price_scheduler_PublishInput__Output, _price_scheduler_PublishResponse>;
  
}

export interface ServiceDefinition extends grpc.ServiceDefinition {
  cancel: MethodDefinition<_price_scheduler_CancelInput, _price_scheduler_CancelResponse, _price_scheduler_CancelInput__Output, _price_scheduler_CancelResponse__Output>
  publish: MethodDefinition<_price_scheduler_PublishInput, _price_scheduler_PublishResponse, _price_scheduler_PublishInput__Output, _price_scheduler_PublishResponse__Output>
}
