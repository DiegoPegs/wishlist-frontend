// src/components/ui/Button.tsx

'use client'; // Adicione se estiver usando hooks como useState

import { ComponentProps } from 'react';
import { LucideLoader2 } from 'lucide-react'; // Um bom ícone de spinner

// Definindo as variantes que nosso botão pode ter
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
  variant?: ButtonVariant;
}

export function Button({
  children,
  isLoading,
  variant = 'primary', // 'primary' será o padrão
  className,
  ...props
}: ButtonProps) {
  // Mapeamento de variantes para classes do Tailwind
  // O Tailwind agora consegue ler todas essas classes diretamente.
  const getVariantClasses = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary/90';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary/90';
      case 'ghost':
        return 'bg-transparent text-secondary hover:bg-secondary/10';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`flex items-center justify-center rounded-md px-4 py-2 font-display font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${getVariantClasses(
        variant,
      )} ${className}`}
    >
      {isLoading ? (
        <LucideLoader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}