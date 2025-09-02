import { Adapter, EventProperties } from "../types";

export function consoleAdapter(): Adapter {
  return {
    id: "console",
    capabilities: ["track", "identify", "group", "page", "reset"],
    init: () => {
      console.log("🚀 Console adapter initialized");
    },
    track: (name: string, properties?: EventProperties) => {
      console.log(
        `📊 Track: ${name}`,
        properties
          ? `\n   Properties: ${JSON.stringify(properties, null, 2)}`
          : ""
      );
    },
    identify: (userId: string, properties?: EventProperties) => {
      console.log(
        `👤 Identify: ${userId}`,
        properties
          ? `\n   Properties: ${JSON.stringify(properties, null, 2)}`
          : ""
      );
    },
    group: <T extends string>(
      group: string,
      type: T,
      properties?: EventProperties
    ) => {
      console.log(
        `👥 Group: ${group} (${type})`,
        properties
          ? `\n   Properties: ${JSON.stringify(properties, null, 2)}`
          : ""
      );
    },
    page: (name: string, properties?: EventProperties) => {
      console.log(
        `📄 Page: ${name}`,
        properties
          ? `\n   Properties: ${JSON.stringify(properties, null, 2)}`
          : ""
      );
    },
    reset: () => {
      console.log("🔄 Reset");
    },
    ready: true,
  };
}
