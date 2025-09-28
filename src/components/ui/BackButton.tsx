'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Voltar
    </Button>
  );
}