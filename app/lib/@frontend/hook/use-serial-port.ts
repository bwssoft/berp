"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sleep } from "../../util";

interface Props {
  handleConnection?: (port: ISerialPort) => void;
  handleDisconnection?: (port: ISerialPort) => void;
}

type Reader = ReadableStreamDefaultReader<Uint8Array>;

export const useSerialPort = (props: Props) => {
  const { handleDisconnection, handleConnection } = props;
  const [ports, setPorts] = useState<ISerialPort[]>([]);
  const readerMapRef = useRef<WeakMap<ISerialPort, Reader>>(new WeakMap());

  const releaseReader = useCallback(async (port: ISerialPort) => {
    const reader = readerMapRef.current.get(port);
    if (!reader) {
      return;
    }

    readerMapRef.current.delete(port);

    try {
      await reader.cancel();
    } catch (error) {
      console.error("Error cancelling reader:", error);
    } finally {
      try {
        reader.releaseLock();
      } catch (releaseError) {
        console.error("Error releasing reader lock:", releaseError);
      }
    }
  }, []);

  const handleConnect = useCallback(
    (e: Event) => {
      const target = e.target as ISerialPort | null;
      if (!target) return;
      setPorts((prev) => [...prev, target]);
      handleConnection?.(target);
    },
    [handleConnection]
  );

  const handleDisconnect = useCallback(
    (e: Event) => {
      const target = e.target as ISerialPort | null;
      if (!target) return;
      setPorts((prev) => prev.filter((el) => el !== target));
      void releaseReader(target);
      handleDisconnection?.(target);
    },
    [handleDisconnection, releaseReader]
  );

  useEffect(() => {
    // if (isFirstRendering.current) {
    //   isFirstRendering.current = false
    if (typeof window !== "undefined" && "serial" in navigator) {
      const _navigator = navigator as INavigator;

      _navigator.serial.getPorts().then((ports) => {
        setPorts(ports);
      });

      _navigator.serial.addEventListener("connect", handleConnect);
      _navigator.serial.addEventListener("disconnect", handleDisconnect);

      return () => {
        _navigator.serial.removeEventListener("connect", handleConnect);
        _navigator.serial.removeEventListener("disconnect", handleDisconnect);
      };
    }
    // }
  }, [handleConnect, handleConnection, handleDisconnect, handleDisconnection]);

  //Serial
  const requestPort = async () => {
    try {
      const port = await (navigator as INavigator).serial.requestPort();
      setPorts((prev) => [...prev, port]);
    } catch (err) {
      console.error("Error requesting port:", err);
    }
  };

  //SerialPort
  const openPort = async (port: ISerialPort, options: SerialOptions) => {
    try {
      await port.open(options);
      await sleep(500);
      // await port.setSignals({ dataTerminalReady: true });
    } catch (e) {
      console.error("on open port", e);
    }
  };

  const closePort = async (port: ISerialPort) => {
    try {
      if (port.readable) {
        if (port.readable.locked) {
          await releaseReader(port);
        }
      }

      if (port.writable) {
        if (port.writable.locked) {
          const writer = port.writable.getWriter();
          await writer.abort();
          writer.releaseLock();
        }
      }

      await port.close();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Error when close port");
    }
  };

  const forgetPort = async (port: ISerialPort): Promise<void> => {
    try {
      await releaseReader(port);
      await port.forget();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Error when forgetting serial port");
    }
  };

  const getInfo = (port: ISerialPort) => {
    const info = port.getInfo();
    return info;
  };

  const getSignals = async (port: ISerialPort) => {
    const signals = await port.getSignals();
    return signals;
  };

  const getReader = async (port: ISerialPort) => {
    if (!port?.readable) {
      throw Error("Readable stream not available");
    }

    const storedReader = readerMapRef.current.get(port);
    if (storedReader) {
      return storedReader;
    }

    if (port.readable.locked) {
      throw Error("Readable stream is already locked");
    }

    const reader = port.readable.getReader();

    const cleanup = () => {
      readerMapRef.current.delete(port);
    };

    reader.closed.catch(() => undefined).finally(cleanup);

    const originalReleaseLock = reader.releaseLock.bind(reader);
    reader.releaseLock = () => {
      cleanup();
      originalReleaseLock();
    };

    readerMapRef.current.set(port, reader);

    return reader;
  };

  const writeToPort = async (port: ISerialPort, data: string) => {
    if (!port.writable) {
      throw new Error("Writable stream not available");
    }

    try {
      const writer = port.writable.getWriter();
      if (!writer) {
        throw new Error("Writer not available");
      }
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(data));
      writer.releaseLock();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Error writing to port");
    }
  };

  return {
    ports,
    requestPort,
    closePort,
    forgetPort,
    getInfo,
    getSignals,
    openPort,
    writeToPort,
    getReader,
    releaseReader,
  };
};

export interface ISerialPort {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  open(options: SerialOptions): Promise<void>;
  close(): Promise<void>;
  forget(): Promise<void>;
  getInfo(): SerialPortInfo;
  setSignals(signals?: SerialOutputSignals): Promise<void>;
  getSignals(): Promise<SerialInputSignals>;
  addEventListener(
    type: "connect" | "disconnect",
    listener: (this: ISerialPort, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: "connect" | "disconnect",
    listener: (this: ISerialPort, ev: Event) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface SerialOptions {
  baudRate: number;
  dataBits?: 7 | 8;
  stopBits?: 1 | 2;
  parity?: "none" | "even" | "odd";
  bufferSize?: number;
  flowControl?: "none" | "hardware";
}

interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

interface SerialOutputSignals {
  dataTerminalReady?: boolean;
  requestToSend?: boolean;
  break?: boolean;
}

interface SerialInputSignals {
  dataCarrierDetect: boolean;
  clearToSend: boolean;
  ringIndicator: boolean;
  dataSetReady: boolean;
}

//=========================================

interface SerialPortRequestOptions {
  filters?: SerialPortFilter[];
}

interface SerialPortFilter {
  usbVendorId?: number;
  usbProductId?: number;
}

interface Serial {
  getPorts(): Promise<ISerialPort[]>;
  requestPort(options?: SerialPortRequestOptions): Promise<ISerialPort>;
  addEventListener(
    type: "connect" | "disconnect",
    listener: (this: Navigator, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: "connect" | "disconnect",
    listener: (this: Navigator, ev: Event) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

export interface INavigator extends Navigator {
  serial: Serial;
}

export const readReader = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  timeout = 10_000, // timeout total (hard-stop)
  idleMs = 1500 // encerra se ficar ocioso por esse tempo
): Promise<string[]> => {
  const decoder = new TextDecoder();
  const lines = new Set<string>();
  let buffer = "";

  const start = Date.now();
  let idleBudget = idleMs; // janela de ociosidade (pode ser ajustada se quiser)

  // Lê um passo: corrida entre read() e timer de ociosidade
  const readOnceOrIdle = async (): Promise<"read" | "idle" | "done"> => {
    const idleSentinel = Symbol("idle");
    const perRead = reader.read();

    const winner = await Promise.race([
      perRead,
      new Promise<typeof idleSentinel>((resolve) =>
        setTimeout(() => resolve(idleSentinel), idleBudget)
      ),
    ]);

    if (winner === idleSentinel) return "idle";

    const { value, done } = winner as ReadableStreamReadResult<Uint8Array>;
    if (done) return "done";

    if (value && value.byteLength) {
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop() ?? "";
      for (const line of parts) {
        if (line.length) lines.add(line);
      }

      // recebeu dados → reseta janela de ociosidade
      idleBudget = idleMs;
      return "read";
    }

    return "read";
  };

  try {
    while (true) {
      // Hard timeout total
      if (Date.now() - start > timeout) break;

      const state = await readOnceOrIdle();

      if (state === "done") break;

      if (state === "idle") {
        break;
      }

      // state === "read": continua
    }
  } finally {
    // empurra eventual parcial
    if (buffer.length) lines.add(buffer);

    // Se estourou o timeout total e o read() ficou pendente, cancele para liberar o lock
    if (Date.now() - start > timeout) {
      try {
        await reader.cancel();
      } catch {}
      try {
        reader.releaseLock();
      } catch {}
    }
  }

  return Array.from(lines);
};
