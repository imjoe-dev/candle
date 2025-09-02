import { createContext, useContext } from "react";

import { CandleClient } from "../core/client";

const Context = createContext<CandleClient | null>(null);

type CandleProviderProps = React.PropsWithChildren<{
  client: CandleClient;
}>;

export const CandleProvider = ({ children, client }: CandleProviderProps) => {
  return <Context.Provider value={client}>{children}</Context.Provider>;
};

export const useCandle = () => {
  const client = useContext(Context);
  if (!client) {
    throw new Error("Candle client not found");
  }

  return client;
};
