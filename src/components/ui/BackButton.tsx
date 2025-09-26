'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <ChevronLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
}
