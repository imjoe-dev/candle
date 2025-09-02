import { Adapter } from "./adapter";
import { EventProperties } from "./json";

export interface Client {
  init: () => void | Promise<void>;
  track: (name: string, properties?: EventProperties) => void | Promise<void>;
  identify: (
    userId: string,
    properties?: EventProperties
  ) => void | Promise<void>;
  group: <T extends string>(
    group: string,
    type: T,
    properties?: EventProperties
  ) => void | Promise<void>;
  page?: (name: string, properties?: EventProperties) => void | Promise<void>;
  reset: () => void | Promise<void>;
}

export type CandleClientOptions = {
  autoInit?: boolean;
  queueSizeLimit?: number;
  queueTimeLimit?: number;
};

export type AdapterState = {
  status: "pending" | "initialized" | "failed";
  adapter: Adapter;
  error?: Error;
};

export type QueueItem<T extends string = string> =
  | {
      kind: "track";
      name: string;
      properties?: EventProperties;
      timestamp: number;
    }
  | {
      kind: "identify";
      userId: string;
      properties?: EventProperties;
      timestamp: number;
    }
  | {
      kind: "group";
      group: string;
      type: T;
      properties?: EventProperties;
      timestamp: number;
    }
  | {
      kind: "reset";
      timestamp: number;
    };
