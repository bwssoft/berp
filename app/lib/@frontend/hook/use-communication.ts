import { useCallback } from "react";
import { sleep } from "../../util";

export interface Message<TransformReturn = any> {
  message: string;
  key: string;
  transform?: (raw: any) => TransformReturn;
  timeout?: number;
}

export interface Props<Transport> {
  openTransport: (transport: Transport) => Promise<void>;
  closeTransport: (transport: Transport) => Promise<void>;
  sendMessage: (
    transport: Transport,
    message: string,
    timeout?: number
  ) => Promise<any>;
  options?: {
    delayBetweenMessages?: number;
    maxRetriesPerMessage?: number;
    maxOverallRetries?: number;
  };
}

type MessagesResult<M extends readonly Message<any>[]> = {
  [P in M[number] as P["key"]]: P["transform"] extends (raw: any) => infer R
    ? R | undefined
    : any | undefined;
};

export function useCommunication<Transport>(props: Props<Transport>) {
  const { openTransport, closeTransport, sendMessage, options = {} } = props;
  const {
    delayBetweenMessages = 150,
    maxRetriesPerMessage = 3,
    maxOverallRetries = 2,
  } = options;

  const sendSingleMessage = useCallback(
    async <TransformReturn>(
      transport: Transport,
      message: string,
      transform: (raw: any) => TransformReturn,
      timeout?: number
    ): Promise<TransformReturn | undefined> => {
      let attempts = 0;
      while (attempts < maxRetriesPerMessage) {
        try {
          const rawResponse = await sendMessage(transport, message, timeout);
          if (rawResponse != null) {
            return transform(rawResponse);
          }
          return undefined;
        } catch (error) {
          console.error(
            `ERROR [sendSingleMessage] tentativa ${attempts + 1} para a mensagem ${message}:`,
            error
          );
        }
        attempts++;
      }
      return undefined;
    },
    [maxRetriesPerMessage, sendMessage]
  );

  const sendMultipleMessages = useCallback(
    async <M extends readonly Message<any>[]>(input: {
      transport: Transport;
      messages: M;
      depth?: number;
    }): Promise<MessagesResult<M>> => {
      const { transport, messages, depth = 0 } = input;
      if (depth >= maxOverallRetries) {
        throw new Error(
          "Número máximo de tentativas atingido. Abortando execução."
        );
      }

      const responses = {} as MessagesResult<M>;

      try {
        await openTransport(transport);

        for (const { message, key, transform, timeout } of messages) {
          const _transform = transform ?? ((raw: any) => raw);
          const response = await sendSingleMessage(
            transport,
            message,
            _transform,
            timeout
          );
          responses[key as keyof MessagesResult<M>] = response as any;
          await sleep(delayBetweenMessages);
        }

        await closeTransport(transport);
        return responses;
      } catch (error) {
        console.error("ERROR [sendMultipleMessages]", error);
        await closeTransport(transport);
        return sendMultipleMessages({ transport, messages, depth: depth + 1 });
      }
    },
    [
      openTransport,
      closeTransport,
      sendSingleMessage, // se estiver definido com useCallback ou estável
      delayBetweenMessages,
      maxOverallRetries,
    ]
  );

  return {
    sendMultipleMessages,
  };
}
