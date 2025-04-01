// Original file: app/lib/@backend/infra/gateway/bmessage/@base/bmessage.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../google/protobuf/Empty';
import type { HtmlParams as _mail_HtmlParams, HtmlParams__Output as _mail_HtmlParams__Output } from '../mail/HtmlParams';

export interface MailServiceClient extends grpc.Client {
  html(argument: _mail_HtmlParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  html(argument: _mail_HtmlParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  html(argument: _mail_HtmlParams, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  html(argument: _mail_HtmlParams, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface MailServiceHandlers extends grpc.UntypedServiceImplementation {
  html: grpc.handleUnaryCall<_mail_HtmlParams__Output, _google_protobuf_Empty>;
  
}

export interface MailServiceDefinition extends grpc.ServiceDefinition {
  html: MethodDefinition<_mail_HtmlParams, _google_protobuf_Empty, _mail_HtmlParams__Output, _google_protobuf_Empty__Output>
}
