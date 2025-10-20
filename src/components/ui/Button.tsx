// Componente Button - Equivalente a PrimaryButton del mobile
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark' | 'light';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({ 
  variant = 'dark', 
  children, 
  fullWidth = false,
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-primary-950 text-white hover:bg-primary-900': variant === 'dark',
          'bg-white text-primary-950 border border-primary-200 hover:bg-primary-50': variant === 'light',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
