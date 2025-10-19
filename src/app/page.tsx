import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionar para o idioma padrão (inglês)
  redirect('/en');
}
