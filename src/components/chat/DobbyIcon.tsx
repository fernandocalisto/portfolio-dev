import React from 'react';

interface DobbyIconProps {
  className?: string;
  size?: number;
}

/**
 * Ícone minimalista, vetorizado e monocromático do rosto de um elfo doméstico (Dobby),
 * com suas orelhas pontiagudas laterais características e traços simplificados.
 */
export const DobbyIcon: React.FC<DobbyIconProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Contorno do Rosto do Elfo */}
      <path
        d="M17 15C17 9.5 31 9.5 31 15C31 22 28 31 24 33C20 31 17 22 17 15Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Orelha Esquerda Característica */}
      <path
        d="M17 17C11 16 3 13 2 11C3 16 9 22 17 23"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Detalhe interno sutil da orelha esquerda */}
      <path
        d="M15 18C10 18 5 15 4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Orelha Direita Característica */}
      <path
        d="M31 17C37 16 45 13 46 11C45 16 39 22 31 23"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Detalhe interno sutil da orelha direita */}
      <path
        d="M33 18C38 18 43 15 44 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Olhos Grandes e Expressivos */}
      <circle cx="21" cy="18.5" r="2.2" fill="currentColor" />
      <circle cx="27" cy="18.5" r="2.2" fill="currentColor" />

      {/* Nariz Simplificado */}
      <path
        d="M23.5 22.5L24 23.5L24.5 22.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sorriso Amigável e Leve */}
      <path
        d="M21.5 26.5C22.5 28 25.5 28 26.5 26.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
