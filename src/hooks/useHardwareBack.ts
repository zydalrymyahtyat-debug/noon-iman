import { useEffect, useRef } from 'react';

export function useHardwareBack(isOpen: boolean, onClose: () => void) {
  const isPoppedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      isPoppedRef.current = false;
      window.history.pushState({ layer: true, appInit: true }, '');

      const handlePopState = (e: PopStateEvent) => {
        isPoppedRef.current = true;
        onClose();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (!isPoppedRef.current) {
          // UI caused close, so pop the history state we pushed
          // To prevent this from triggering other listeners negatively, we do it in a microtask maybe?
          // Actually, history.back() is asynchronous.
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose]);
}
