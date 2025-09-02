import type { EventProperties } from "./json";

export type AdapterCapabilities =
  | "track"
  | "identify"
  | "group"
  | "page"
  | "reset";

export type Adapter = Readonly<{
  id: "amplitude" | "console";
  capabilities: readonly AdapterCapabilities[];
  init: () => Promise<void> | void;
  track: (name: string, properties?: EventProperties) => Promise<void> | void;
  identify: (
    userId: string,
    properties?: EventProperties
  ) => Promise<void> | void;
  group: <T extends string>(
    group: string,
    type: T,
    properties?: EventProperties
  ) => Promise<void> | void;
  page?: (name: string, properties?: EventProperties) => Promise<void> | void;
  reset: () => Promise<void> | void;
  ready: Promise<boolean> | (() => boolean);
}>;
