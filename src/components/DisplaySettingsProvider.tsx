"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type DisplaySettingsContextValue = {
  showTransliteration: boolean;
  setShowTransliteration: Dispatch<SetStateAction<boolean>>;
};

const STORAGE_KEY = "dua-show-transliteration";

const DisplaySettingsContext = createContext<DisplaySettingsContextValue | undefined>(undefined);

export function DisplaySettingsProvider({ children }: { children: ReactNode }) {
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

  useEffect(() => {
    try {
      const savedPreference = window.localStorage.getItem(STORAGE_KEY);
      if (savedPreference !== null) {
        setShowTransliteration(savedPreference === "true");
      }
    } finally {
      setHasLoadedSettings(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedSettings) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(showTransliteration));
  }, [hasLoadedSettings, showTransliteration]);

  return (
    <DisplaySettingsContext.Provider value={{ showTransliteration, setShowTransliteration }}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export function useDisplaySettings() {
  const context = useContext(DisplaySettingsContext);

  if (!context) {
    throw new Error("useDisplaySettings must be used within DisplaySettingsProvider");
  }

  return context;
}
