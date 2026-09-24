import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { WakeupStatus } from "../services/serverWakeup";
import {
  subscribeWakeup,
  ensureServerReady,
  retryWakeup,
} from "../services/serverWakeup";

interface ServerWakeupContextValue {
  status: WakeupStatus;
  /** Call when user navigates to /login or /register — returns a promise. */
  ensureReady: () => Promise<void>;
  retry: () => Promise<void>;
}

const ServerWakeupContext = createContext<ServerWakeupContextValue | null>(null);

export const ServerWakeupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<WakeupStatus>("idle");

  useEffect(() => {
    const unsub = subscribeWakeup(setStatus);
    return unsub;
  }, []);

  return (
    <ServerWakeupContext.Provider
      value={{ status, ensureReady: ensureServerReady, retry: retryWakeup }}
    >
      {children}
    </ServerWakeupContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useServerWakeup(): ServerWakeupContextValue {
  const ctx = useContext(ServerWakeupContext);
  if (!ctx)
    throw new Error(
      "useServerWakeup must be used inside <ServerWakeupProvider>"
    );
  return ctx;
}
