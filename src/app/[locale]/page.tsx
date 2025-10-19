import { redirect } from 'next/navigation';

type Locale = 'en' | 'pt-BR';

interface PageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  // Redirecionar para a página de login com o idioma atual
  redirect(`/${locale}/login`);
}
