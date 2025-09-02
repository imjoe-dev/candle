import { EventProperties } from "../types";

export type CandleClientOptions = {
  autoInit?: boolean;
};

export type AdapterState = "pending" | "initialized" | "failed";

export type QueueItem =
  | {
      kind: "track";
      name: string;
      properties?: EventProperties;
    }
  | {
      kind: "identify";
      userId: string;
      properties?: EventProperties;
    }
  | {
      kind: "group";
      group: string;
      type: string;
      properties?: EventProperties;
    }
  | {
      kind: "reset";
    };
