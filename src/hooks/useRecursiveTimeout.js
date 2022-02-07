import {
  useCallback, useEffect, useRef, useState,
} from 'react';

export const useRecursiveTimeout = (callback, delay) => {
  const [isRunning, setIsRunning] = useState(false);
  const stop = useCallback(() => setIsRunning(false), [setIsRunning]);
  const play = useCallback(() => setIsRunning(true), [setIsRunning]);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === -1) {
      return;
    }

    if (!isRunning) {
      return;
    }

    let id = 0;

    const tick = () => {
      if (!isRunning) return clearTimeout(id);
      savedCallback.current();
      requestAnimationFrame(() => (id = setTimeout(tick, delay)));
    };
    requestAnimationFrame(() => (id = setTimeout(tick, delay)));

    return () => {
      if (id) clearTimeout(id);
      stop();
    };
  }, [isRunning, delay, stop]);

  return { play, stop };
};
