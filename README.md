# Candle

A lightweight, adapter-based analytics client with built-in queue management and React integration.

## Features

- **Multi-adapter support**: Use multiple analytics providers simultaneously
- **Smart queueing**: Events are queued until adapters are ready, with configurable size and time limits
- **Capability validation**: Only calls adapters that support specific operations
- **React integration**: Built-in React context and hooks
- **TypeScript support**: Full type safety throughout

## Installation

```bash
npm install candle
```

## Basic Usage

```typescript
import { CandleClient } from "candle";
import { amplitudeAdapter } from "candle/adapters/amplitude";
import { consoleAdapter } from "candle/adapters/console";

const client = new CandleClient([
  amplitudeAdapter("your-api-key"),
  consoleAdapter(),
]);

// Track events
client.track("user_signup", { plan: "premium" });

// Identify users
client.identify("user-123", { email: "user@example.com" });

// Group users
client.group("company-456", "organization", { name: "Acme Corp" });

// Reset user data
client.reset();
```

## React Usage

```tsx
import { CandleProvider, useCandle } from "candle/react";

function App() {
  return (
    <CandleProvider client={client}>
      <Dashboard />
    </CandleProvider>
  );
}

function Dashboard() {
  const candle = useCandle();

  const handleClick = () => {
    candle.track("button_clicked", { location: "dashboard" });
  };

  return <button onClick={handleClick}>Track Event</button>;
}
```

## Configuration

```typescript
const client = new CandleClient(adapters, {
  autoInit: true, // Initialize adapters automatically (default: true)
  queueSizeLimit: 100, // Maximum queued events (default: 100)
  queueTimeLimit: 60000, // Event expiration time in ms (default: 60000)
});
```

## Available Adapters

- **Amplitude**: `amplitudeAdapter(apiKey, options?)`
- **Console**: `consoleAdapter()` - For debugging

## Queue Management

Events are automatically queued when adapters aren't ready and processed once initialization completes. The queue has built-in limits:

- **Size limit**: Removes oldest events when limit is reached
- **Time limit**: Automatically expires old events
- **Performance optimized**: Lazy cleanup with efficient in-place removal

## License

ISC
