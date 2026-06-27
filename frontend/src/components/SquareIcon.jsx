import React from 'react';

/**
 * Simple square SVG icon matching the style of other step icons.
 * Accepts a `className` prop for sizing and color (e.g., `text-squid-pink w-4 h-4`).
 */
export default function SquareIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" />
    </svg>
  );
}
