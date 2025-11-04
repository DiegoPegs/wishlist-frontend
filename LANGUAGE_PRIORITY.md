# Priorização de Idioma do Usuário

## Visão Geral

O sistema agora prioriza o idioma do perfil do usuário em vez do idioma do navegador. A ordem de prioridade é:

1. **Idioma do perfil do usuário** (armazenado no backend e no cookie `user-language`)
2. **Idioma preferido** (armazenado no localStorage e no cookie `preferred-language`)
3. **Idioma do navegador** (header `accept-language`)
4. **Idioma padrão** (`pt-BR`)

## Implementação

### 1. Backend - Endpoint de Atualização

O backend deve implementar o seguinte endpoint:

```
PUT /users/me/language
Content-Type: application/json

{
  "language": "pt-BR"
}
```

**Resposta:**
```json
{
  "language": "pt-BR"
}
```

O campo `language` também deve ser retornado na consulta do usuário (`GET /users/me`).

### 2. Frontend - Componentes Modificados

#### 2.1. Tipos (TypeScript)

**`src/types/auth.ts`**
- Adicionado campo `language?: string` à interface `User`

**`src/types/auth-dto.ts`**
- Adicionado interface `UpdateLanguageDto`
- Adicionado campo `language?: string` à interface `UserProfile`

#### 2.2. Hook de Atualização

**`src/hooks/useUpdateLanguage.ts`** (novo arquivo)
- Hook que chama a API para atualizar o idioma do usuário
- Atualiza o estado do Zustand
- Atualiza o localStorage
- Invalida queries relacionadas

#### 2.3. Middleware

**`src/middleware.ts`**
- Implementa função customizada `getLocale()` que verifica na ordem:
  1. Cookie `user-language` (idioma do perfil)
  2. Cookie `preferred-language` (idioma preferido)
  3. Header `accept-language` (idioma do navegador)
  4. Idioma padrão (`pt-BR`)
- Adiciona header `x-user-locale` nas respostas

#### 2.4. Componente de Seleção

**`src/components/LanguageSelector.tsx`**
- Ao trocar o idioma:
  1. Salva no localStorage
  2. Salva no cookie `user-language`
  3. Se autenticado, chama a API para atualizar no backend
  4. Navega para a nova URL com o locale

#### 2.5. Store de Autenticação

**`src/store/auth.store.ts`**
- Ao fazer login ou verificar autenticação:
  1. Carrega o campo `language` do perfil do usuário
  2. Salva no cookie `user-language` se disponível
  3. Atualiza o localStorage

#### 2.6. Hook de Atualização de Usuário

**`src/hooks/useUpdateUser.ts`**
- Inclui o campo `language` ao atualizar dados do usuário

## Fluxo de Funcionamento

### Primeiro Acesso (Usuário não autenticado)
1. Middleware verifica cookies → não encontra
2. Middleware verifica `accept-language` → usa idioma do navegador
3. Aplicação carrega no idioma do navegador

### Login
1. Usuário faz login
2. Backend retorna dados do usuário incluindo `language`
3. Frontend salva `language` no cookie `user-language`
4. Na próxima requisição, middleware usa o idioma do perfil

### Troca de Idioma (Usuário autenticado)
1. Usuário seleciona novo idioma no `LanguageSelector`
2. Idioma é salvo no localStorage
3. Idioma é salvo no cookie `user-language`
4. API é chamada para atualizar no backend (PUT `/users/me/language`)
5. Página é recarregada com o novo idioma

### Troca de Idioma (Usuário não autenticado)
1. Usuário seleciona novo idioma
2. Idioma é salvo no localStorage
3. Idioma é salvo no cookie `user-language`
4. Página é recarregada com o novo idioma
5. Quando fizer login, o idioma será atualizado no backend

## Cookies Utilizados

- **`user-language`**: Idioma do perfil do usuário (prioritário)
- **`preferred-language`**: Idioma preferido (fallback)
- Ambos com validade de 1 ano (`max-age=31536000`)
- Path: `/` (disponível em toda a aplicação)

## Testes

Para testar a implementação:

1. **Teste 1: Primeiro acesso**
   - Acesse a aplicação sem estar logado
   - Verifique se usa o idioma do navegador

2. **Teste 2: Login com idioma definido**
   - Configure um idioma no backend para um usuário
   - Faça login
   - Verifique se o idioma do perfil é usado

3. **Teste 3: Troca de idioma autenticado**
   - Faça login
   - Troque o idioma
   - Verifique se a API foi chamada (DevTools → Network)
   - Recarregue a página e verifique se mantém o novo idioma

4. **Teste 4: Troca de idioma não autenticado**
   - Sem estar logado, troque o idioma
   - Verifique se o cookie é salvo
   - Faça login e verifique se o idioma é mantido

## Requisitos do Backend

O backend deve:

1. Adicionar campo `language` ao modelo de usuário
2. Implementar endpoint `PUT /users/me/language`
3. Retornar campo `language` em `GET /users/me`
4. Validar que o idioma enviado seja um dos suportados (`en`, `pt-BR`)

## Configuração

Idiomas suportados estão definidos em:
- `src/middleware.ts` → array `locales`
- `src/components/LanguageSelector.tsx` → array `languages`

Para adicionar novos idiomas:
1. Adicionar ao array `locales` no middleware
2. Adicionar ao array `languages` no LanguageSelector
3. Criar arquivo de tradução em `src/messages/{locale}.json`

