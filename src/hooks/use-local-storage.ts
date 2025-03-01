'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize with stored value or initial value - only on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      // Only update state if we have a value in localStorage
      if (item) {
        const value = JSON.parse(item);
        setStoredValue(value);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      // Keep the initial value in case of error
    }
    // Only depends on key, runs once per key when component mounts
  }, [key]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
} 