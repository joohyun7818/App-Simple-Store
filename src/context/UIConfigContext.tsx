import React, { createContext, useContext, useMemo, useState } from "react";
import type { UIConfig } from "../types";

const defaultUIConfig: UIConfig = {
  theme: "default",
  primaryColor: "#007bff",
  showDiscount: false,
  featuredCategories: ["전자제품", "의류", "도서"],
  headerMessage: "AI Store에 오신 것을 환영합니다!",
};

type UIConfigContextType = {
  uiConfig: UIConfig;
  setUIConfig: (config: UIConfig) => void;
  resetUIConfig: () => void;
};

const UIConfigContext = createContext<UIConfigContextType | undefined>(
  undefined
);

export function UIConfigProvider({ children }: { children: React.ReactNode }) {
  const [uiConfig, setUIConfigState] = useState<UIConfig>(defaultUIConfig);

  const value = useMemo(
    () => ({
      uiConfig,
      setUIConfig: (config: UIConfig) => setUIConfigState(config),
      resetUIConfig: () => setUIConfigState(defaultUIConfig),
    }),
    [uiConfig]
  );

  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  );
}

export function useUIConfig() {
  const ctx = useContext(UIConfigContext);
  if (!ctx)
    throw new Error("useUIConfig must be used within a UIConfigProvider");
  return ctx;
}
