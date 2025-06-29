import { useCallback } from "react";
import { sleep } from "../../util";

/**
 * R = retorno de transform;
 * M = shape de metadados extras.
 */
export type Message<R = any, M extends object = {}> = M & {
  key: string;
  command: string;
  transform?: (raw: any) => R;
  timeout?: number;
};

export interface Props<Transport, M extends object = {}> {
  openTransport: (transport: Transport) => Promise<void>;
  closeTransport: (transport: Transport) => Promise<void>;
  sendMessage: (transport: Transport, msg: Message<any, M>) => Promise<any>;
  options?: {
    delayBetweenMessages?: number;
    maxRetriesPerMessage?: number;
    maxOverallRetries?: number;
  };
}

class RetryableMessageError extends Error {
  constructor(
    message: string,
    readonly meta: { command: string; attempt: number; cause?: unknown }
  ) {
    super(message);
    this.name = "RetryableMessageError";
  }
}

class RetryLimitExceededError extends Error {
  constructor(
    message: string,
    readonly meta?: { command?: string; attempts?: number }
  ) {
    super(message);
    this.name = "RetryLimitExceededError";
  }
}

export function useCommunication<Transport, M extends object = {}>(
  props: Props<Transport, M>
) {
  const { openTransport, closeTransport, sendMessage, options = {} } = props;

  const {
    delayBetweenMessages = 150,
    maxRetriesPerMessage = 3,
    maxOverallRetries = 2,
  } = options;

  const sendSingleMessage = useCallback(
    async <R>(
      transport: Transport,
      msg: Message<R, M>
    ): Promise<R | undefined> => {
      let attempts = 0;
      while (attempts < maxRetriesPerMessage) {
        try {
          const raw = await sendMessage(transport, msg);
          if (raw != null && msg.transform) {
            return msg.transform(raw);
          } else if (raw != null) {
            return raw;
          }
          return undefined;
        } catch (error) {
          const err = new RetryableMessageError(
            `Erro ao enviar mensagem "${msg.command}", tentativa ${attempts + 1}.`,
            { command: msg.command, attempt: attempts + 1, cause: error }
          );
          console.error(err);
        }
        attempts++;
      }

      throw new RetryLimitExceededError(
        `Limite de tentativas excedido para comando "${msg.command}".`,
        { command: msg.command, attempts }
      );
    },
    [maxRetriesPerMessage, sendMessage]
  );

  const sendMultipleMessages = useCallback(
    async <Msgs extends readonly Message<any, M>[]>(input: {
      transport: Transport;
      messages: Msgs;
      depth?: number;
    }): Promise<{
      [P in Msgs[number] as P["key"]]: P["transform"] extends (
        r: any
      ) => infer R
        ? R
        : any;
    }> => {
      const { transport, messages, depth = 0 } = input;
      if (depth >= maxOverallRetries) {
        throw new RetryLimitExceededError(
          "Limite máximo de tentativas para grupo de mensagens.",
          {
            attempts: depth,
          }
        );
      }

      const results = {} as any;
      try {
        await openTransport(transport);

        for (const msg of messages) {
          const res = await sendSingleMessage(transport, msg);
          results[msg.key] = res;
          await sleep(delayBetweenMessages);
        }

        await closeTransport(transport);
        return results;
      } catch (err) {
        await closeTransport(transport);
        return sendMultipleMessages({ transport, messages, depth: depth + 1 });
      }
    },
    [
      openTransport,
      closeTransport,
      sendSingleMessage,
      delayBetweenMessages,
      maxOverallRetries,
    ]
  );

  return { sendMultipleMessages, sendSingleMessage };
}
