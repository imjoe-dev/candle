import * as amplitude from "@amplitude/analytics-browser";

import { Adapter, EventProperties } from "../types";

type AmplitudeAdapterOptions = {
  options?: amplitude.Types.BrowserOptions;
  getEventOptions?: () => Promise<amplitude.Types.EventOptions>;
};

export function amplitudeAdapter(
  apiKey: string,
  options?: AmplitudeAdapterOptions
): Adapter {
  return {
    id: "amplitude",
    capabilities: ["track", "identify", "group", "reset"],
    init: () => {
      amplitude.init(apiKey, options?.options);
    },
    track: async (name: string, properties?: EventProperties) => {
      let eventOptions: amplitude.Types.EventOptions | undefined;
      if (options?.getEventOptions) {
        eventOptions = await options.getEventOptions();
      }

      amplitude.track(name, properties, eventOptions);
    },
    identify: async (userId: string, properties?: EventProperties) => {
      amplitude.setUserId(userId);

      if (!properties) {
        return;
      }

      let eventOptions: amplitude.Types.EventOptions | undefined;
      if (options?.getEventOptions) {
        eventOptions = await options.getEventOptions();
      }

      const identify = new amplitude.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identify.set(key, value);
      });
      amplitude.identify(identify, eventOptions);
    },
    group: async <T extends string>(
      group: string,
      type: T,
      properties?: EventProperties
    ) => {
      if (!properties) {
        throw new Error("Properties are required in amplitude group");
      }

      let eventOptions: amplitude.Types.EventOptions | undefined;
      if (options?.getEventOptions) {
        eventOptions = await options.getEventOptions();
      }

      const identify = new amplitude.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        identify.set(key, value);
      });
      amplitude.groupIdentify(group, type, identify, eventOptions);
    },
    reset: () => {
      amplitude.reset();
    },
    ready: true,
  };
}
