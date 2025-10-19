# Internacionalização (i18n) com next-intl

Este projeto utiliza a biblioteca `next-intl` para gerenciar a internacionalização, seguindo a ordem de prioridade especificada:

## Ordem de Detecção de Idioma

1. **Idioma na URL** (ex: `/en/dashboard`, `/pt-BR/dashboard`)
2. **Preferência do usuário logado** (salva no banco de dados)
3. **Idioma do navegador** do usuário
4. **Idioma padrão** (inglês, 'en')

## Estrutura de Arquivos

```
src/
├── i18n/
│   ├── request.ts          # Configuração do next-intl
│   └── README.md           # Este arquivo
├── messages/
│   ├── en.json            # Traduções em inglês
│   └── pt-BR.json         # Traduções em português
├── middleware.ts           # Middleware para gerenciar rotas de idioma
└── app/
    ├── [locale]/          # Páginas com suporte a idioma
    │   ├── layout.tsx     # Layout com NextIntlClientProvider
    │   ├── page.tsx       # Página principal
    │   ├── login/         # Páginas de autenticação
    │   └── (protected)/   # Páginas protegidas
    └── page.tsx           # Redireciona para /en
```

## Como Usar

### 1. Em Componentes Client-Side

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 2. Em Componentes Server-Side

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('common');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 3. Usando o Hook de Idioma

```tsx
'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="pt-BR">Português</option>
    </select>
  );
}
```

## Adicionando Novas Traduções

1. Adicione as chaves nos arquivos JSON:
   - `src/messages/en.json`
   - `src/messages/pt-BR.json`

2. Use as traduções nos componentes:
   ```tsx
   const t = useTranslations('novaSecao');
   return <p>{t('novaChave')}</p>;
   ```

## Rotas

- `/` → Redireciona para `/en`
- `/en` → Página principal em inglês
- `/pt-BR` → Página principal em português
- `/en/login` → Página de login em inglês
- `/pt-BR/login` → Página de login em português

## Configuração

O middleware está configurado para:
- Detectar idioma automaticamente
- Aplicar prefixo de idioma nas rotas
- Redirecionar para idioma padrão quando necessário

## Idiomas Suportados

- `en` - Inglês (padrão)
- `pt-BR` - Português (Brasil)

Para adicionar novos idiomas, atualize:
1. `src/i18n/request.ts` - Adicione o idioma na lista `locales`
2. `src/middleware.ts` - Adicione o idioma na lista `locales`
3. Crie um novo arquivo `src/messages/[idioma].json`
4. Atualize o componente `LanguageSelector` se necessário
