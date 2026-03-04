"use client";

import { useState, useEffect } from "react";
import { loadData, saveData } from "./storage";

export function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = loadData(key, defaultValue);
    setValue(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveData(key, value);
    }
  }, [value, loaded]);

  return [value, setValue, loaded];
}
