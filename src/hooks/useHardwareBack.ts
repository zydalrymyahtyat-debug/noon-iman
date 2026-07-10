import { useEffect, useRef } from 'react';

export function useHardwareBack(isOpen: boolean, onClose: () => void) {
  const isPoppedRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      isPoppedRef.current = false;
      window.history.pushState({ layer: true, appInit: true }, '');
      const handlePopState = (e: PopStateEvent) => {
        isPoppedRef.current = true;
        onCloseRef.current();
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (!isPoppedRef.current) {
          window.history.back();
        }
      };
    }
  }, [isOpen]);
}
