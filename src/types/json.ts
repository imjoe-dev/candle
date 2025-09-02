export type JsonValue =
  | string
  | number
  | boolean
  | (string | number)[]
  | { [key: string]: JsonValue }
  | { [key: string]: JsonValue }[];

export type EventProperties = Record<string, JsonValue>;
