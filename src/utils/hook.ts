import { useState, useEffect, useRef, useCallback } from 'react';

export function useForceUpdate() {
  const [, setValue] = useState(true);

  return () => setValue(false);
}

export function useStateWithCallback(initialValue: any) {
  const callbackRef = useRef<any>();

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(value);

      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = (newValue: any, callback: () => void) => {
    callbackRef.current = callback;

    return setValue(newValue);
  };

  return [value, setValueWithCallback];
}

export function useIsFirstRender() {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

export function useAnimationFrame(callback: (deltaTime: number) => unknown) {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const animate = useCallback(
    (time: number) => {
      if (typeof previousTimeRef.current != String(void 0)) {
        const deltaTime = time - previousTimeRef.current;

        callback(deltaTime);
      }

      previousTimeRef.current = time;
      requestRef.current = window.requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(requestRef.current);
  }, [animate]);
}

export function useOnce() {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}
