'use client';

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'left' | 'right';
  maxWidthClass?: string;
}

export default function Tooltip({
  text,
  children,
  position = 'top',
  align = 'center',
  maxWidthClass = 'max-w-[220px]',
}: TooltipProps) {
  const [show, setShow] = useState(false);

  if (!text || !text.trim()) return <>{children}</>;

  // Position classes based on direction & alignment
  let posClass = '';
  let arrowClass = '';

  if (position === 'top') {
    if (align === 'right') {
      posClass = 'bottom-full right-0 mb-2';
      arrowClass = 'top-full right-3 border-t-walnut-900 border-x-transparent border-b-transparent';
    } else if (align === 'left') {
      posClass = 'bottom-full left-0 mb-2';
      arrowClass = 'top-full left-3 border-t-walnut-900 border-x-transparent border-b-transparent';
    } else {
      posClass = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      arrowClass = 'top-full left-1/2 -translate-x-1/2 border-t-walnut-900 border-x-transparent border-b-transparent';
    }
  } else if (position === 'bottom') {
    if (align === 'right') {
      posClass = 'top-full right-0 mt-2';
      arrowClass = 'bottom-full right-3 border-b-walnut-900 border-x-transparent border-t-transparent';
    } else if (align === 'left') {
      posClass = 'top-full left-0 mt-2';
      arrowClass = 'bottom-full left-3 border-b-walnut-900 border-x-transparent border-t-transparent';
    } else {
      posClass = 'top-full left-1/2 -translate-x-1/2 mt-2';
      arrowClass = 'bottom-full left-1/2 -translate-x-1/2 border-b-walnut-900 border-x-transparent border-t-transparent';
    }
  } else if (position === 'left') {
    posClass = 'right-full top-1/2 -translate-y-1/2 mr-2';
    arrowClass = 'left-full top-1/2 -translate-y-1/2 border-l-walnut-900 border-y-transparent border-r-transparent';
  } else if (position === 'right') {
    posClass = 'left-full top-1/2 -translate-y-1/2 ml-2';
    arrowClass = 'right-full top-1/2 -translate-y-1/2 border-r-walnut-900 border-y-transparent border-l-transparent';
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-50 ${maxWidthClass} w-max whitespace-normal text-center break-words rounded-lg bg-walnut-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-xl animate-fadeIn pointer-events-none leading-snug ${posClass}`}
        >
          {text}
          <div className={`absolute border-4 ${arrowClass}`} />
        </div>
      )}
    </div>
  );
}
