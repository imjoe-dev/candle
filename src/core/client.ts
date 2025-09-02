import {
  Adapter,
  AdapterCapabilities,
  AdapterState,
  CandleClientOptions,
  Client,
  EventProperties,
  QueueItem,
} from "../types";

export class CandleClient implements Client {
  private adaptersStates: Record<string, AdapterState> = {};
  private mounted = false;
  private queue: QueueItem[] = [];
  private ready = false;
  private options: Required<CandleClientOptions>;
  private lastCleanupTime = 0;
  private cleanupThreshold = 10;

  constructor(private adapters: Adapter[], options: CandleClientOptions = {}) {
    this.options = {
      autoInit: true,
      queueSizeLimit: 100,
      queueTimeLimit: 60000,
      ...options,
    };

    this.adapters.forEach((adapter) => {
      this.adaptersStates[adapter.id] = {
        status: "pending",
        adapter,
      };
    });

    if (this.options.autoInit) {
      this.init();
    }
  }

  async init() {
    if (this.mounted) {
      return;
    }

    this.mounted = true;
    const result = await Promise.allSettled(
      this.adapters.map((adapter) => adapter.init())
    );

    result.forEach((adapter, index) => {
      let state: AdapterState = {
        status: "initialized",
        adapter: this.adapters[index],
      };
      if (adapter.status === "rejected") {
        state = {
          status: "failed",
          adapter: this.adapters[index],
          error: adapter.reason,
        };

        console.error(
          `Adapter ${this.adapters[index].id} failed to initialize. Reason: ${adapter.reason}`
        );
      }

      this.adaptersStates[this.adapters[index].id] = state;
    });

    const hasAnyWorkingAdapter = Object.values(this.adaptersStates).some(
      (state) => state.status === "initialized"
    );

    this.ready = hasAnyWorkingAdapter;
    this.cleanExpiredQueueItems();
    this.queue.forEach((item) => {
      switch (item.kind) {
        case "track":
          this.track(item.name, item.properties);
          break;
        case "identify":
          this.identify(item.userId, item.properties);
          break;
        case "group":
          this.group(item.group, item.type, item.properties);
          break;
        case "reset":
          this.reset();
          break;
      }
    });

    this.queue = [];
  }

  track(name: string, properties?: EventProperties) {
    if (!this.ready) {
      this.addToQueue({
        kind: "track",
        name,
        properties,
        timestamp: Date.now(),
      });
      return;
    }

    this.getCapableAdapters("track").forEach((adapter) => {
      adapter.track(name, properties);
    });
  }

  identify(userId: string, properties?: EventProperties) {
    if (!this.ready) {
      this.addToQueue({
        kind: "identify",
        userId,
        properties,
        timestamp: Date.now(),
      });
      return;
    }

    this.getCapableAdapters("identify").forEach((adapter) => {
      adapter.identify(userId, properties);
    });
  }

  group<T extends string>(
    group: string,
    type: T,
    properties?: EventProperties
  ) {
    if (!this.ready) {
      this.addToQueue({
        kind: "group",
        group,
        type,
        properties,
        timestamp: Date.now(),
      });
      return;
    }

    this.getCapableAdapters("group").forEach((adapter) => {
      adapter.group(group, type, properties);
    });
  }

  reset() {
    if (!this.ready) {
      this.addToQueue({ kind: "reset", timestamp: Date.now() });
      return;
    }

    this.getCapableAdapters("reset").forEach((adapter) => {
      adapter.reset();
    });
  }

  private addToQueue(item: QueueItem) {
    if (this.shouldCleanup()) {
      this.cleanExpiredQueueItems();
    }

    if (this.queue.length >= this.options.queueSizeLimit!) {
      this.queue.shift();
    }

    this.queue.push(item);
  }

  private shouldCleanup(): boolean {
    const now = Date.now();
    const timeSinceLastCleanup = now - this.lastCleanupTime;
    const queueSizeThresholdMet = this.queue.length >= this.cleanupThreshold;
    const timeThresholdMet = timeSinceLastCleanup >= 5000;

    return queueSizeThresholdMet || timeThresholdMet;
  }

  private cleanExpiredQueueItems() {
    const now = Date.now();
    const timeLimit = this.options.queueTimeLimit!;

    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (now - this.queue[i].timestamp >= timeLimit) {
        this.queue.splice(i, 1);
      }
    }

    this.lastCleanupTime = now;
  }

  private getCapableAdapters(capability: AdapterCapabilities) {
    return Object.values(this.adaptersStates)
      .filter(
        (state) =>
          state.status === "initialized" &&
          state.adapter.capabilities.includes(capability)
      )
      .map((state) => state.adapter);
  }
}
