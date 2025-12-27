'use client';

import { forwardRef, useImperativeHandle, useState, useRef } from 'react';

export interface PopupRef {
  start: (timeout?: number) => void;
}

interface PopInfo {
  rank: number;
  header: string;
  message: string;
  footer: string;
}

interface PopupProps {
  popInfo: PopInfo;
}

export const Popup = forwardRef<PopupRef, PopupProps>(({ popInfo }, ref) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useImperativeHandle(ref, () => ({
    start(timeout = 5000) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show popup
      setVisible(true);

      // Hide after timeout
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, timeout);
    },
  }));

  if (!visible) return null;

  const messageClass = `pop-message pop-rank${popInfo.rank}`;

  return (
    <div className="pop-layer">
      <div className="pop-bg"></div>
      <div className="pop-container">
        <div className="pop-header">{popInfo.header}</div>
        <div className={messageClass}>{popInfo.message}</div>
        <div className="pop-footer">{popInfo.footer}</div>
      </div>
    </div>
  );
});

Popup.displayName = 'Popup';
