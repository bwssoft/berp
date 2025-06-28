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
          console.error(
            `ERROR [sendSingleMessage] tentativa ${attempts + 1} para "${msg.command}":`,
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
        throw new Error("Número máximo de tentativas atingido.");
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
        console.error("ERROR [sendMultipleMessages]", err);
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
