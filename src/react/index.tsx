import { createContext, useContext } from "react";

import { CandleClient } from "../core/client";

const Context = createContext<CandleClient | null>(null);

type CandleProviderProps = React.PropsWithChildren<{
  client: CandleClient;
}>;

export function CandleProvider({
  children,
  client,
}: CandleProviderProps): React.JSX.Element {
  return <Context.Provider value={client}>{children}</Context.Provider>;
}

export function useCandle(): CandleClient {
  const client = useContext(Context);
  if (!client) {
    throw new Error("Candle client not found");
  }

  return client;
}
