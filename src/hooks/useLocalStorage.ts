'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    let cancelled = false;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as T;
        queueMicrotask(() => {
          if (!cancelled) setStoredValue(parsed);
        });
      }
    } catch {
      // localStorage not available
    }
    return () => { cancelled = true; };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // localStorage not available
    }
  };

  return [storedValue, setValue] as const;
}
