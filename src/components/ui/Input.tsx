// Componente Input
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-primary-700">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'px-4 py-3 border rounded-lg transition-all',
          'focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'disabled:bg-primary-50 disabled:cursor-not-allowed',
          {
            'border-red-500': error,
            'border-primary-200': !error,
          },
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-primary-500">{helperText}</span>
      )}
    </div>
  );
}
