import React from "react";

interface SpinnerProps {
  /**
   * Tamanho do spinner em pixels.
   */
  size?: number;
  /**
   * Classe de cor do spinner (usada como currentColor nos elementos do SVG).
   */
  color?: string;
}

export function Spinner({ size = 24, color = "text-blue-500" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin ${color}`}
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Círculo de fundo com opacidade reduzida */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Arco que vai girando */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
