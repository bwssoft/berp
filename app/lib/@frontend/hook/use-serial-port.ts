"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sleep } from "../../util";

interface Props {
  handleConnection?: (port: ISerialPort) => void;
  handleDisconnection?: (port: ISerialPort) => void;
}

export const useSerialPort = (props: Props) => {
  const { handleDisconnection, handleConnection } = props;
  const [ports, setPorts] = useState<ISerialPort[]>([]);

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
      handleDisconnection?.(target);
    },
    [handleDisconnection]
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
          const reader = port.readable.getReader();
          await reader.cancel();
          reader.releaseLock();
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

    if (port.readable.locked) {
      throw Error("Readable stream is already locked");
    }

    const reader = port.readable.getReader();

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
