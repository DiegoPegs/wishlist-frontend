# Reenvio de Email de Verificação

## Visão Geral

Implementação da funcionalidade de reenvio de email de verificação na página de perfil do usuário.

## Implementação Frontend

### 1. AuthService
**Arquivo:** `src/lib/authService.ts`

Adicionado método para reenviar email de verificação:

```typescript
resendVerificationEmail: async (): Promise<void> => {
  await api.post('/auth/resend-verification-email');
}
```

### 2. Página de Perfil
**Arquivo:** `src/app/[locale]/(protected)/profile/page.tsx`

- Adicionado estado `isResendingVerification` para controlar loading
- Criado handler `handleResendVerification` que:
  1. Chama o serviço de reenvio
  2. Mostra toast de sucesso ou erro
  3. Gerencia o estado de loading
- Botão "Verificar agora" agora executa a ação:
  - Mostra "Enviando..." durante o processo
  - Fica desabilitado durante o envio
  - Usa toast para feedback visual

## Requisitos do Backend

O backend deve implementar o seguinte endpoint:

### Endpoint: Reenviar Email de Verificação

```
POST /auth/resend-verification-email
Authorization: Bearer {token}
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Email de verificação enviado com sucesso"
}
```

**Resposta de Erro (400):**
```json
{
  "message": "Email já verificado"
}
```

**Resposta de Erro (429):**
```json
{
  "message": "Muitas tentativas. Tente novamente em alguns minutos."
}
```

## Comportamento Esperado

### 1. Usuário com Email Não Verificado
- Visualiza badge amarelo "Não verificado" na página de perfil
- Vê botão "Verificar agora" ao lado do status
- Ao clicar:
  1. Botão muda para "Enviando..."
  2. Requisição é enviada ao backend
  3. Email de verificação é enviado
  4. Toast de sucesso é exibido
  5. Botão volta ao estado normal

### 2. Usuário com Email Verificado
- Visualiza badge verde "Verificado" na página de perfil
- Não vê o botão "Verificar agora"

## Fluxo Completo

```
┌─────────────────────┐
│  Página de Perfil   │
│  (Email não verif.) │
└──────────┬──────────┘
           │
           ▼
    Clica "Verificar agora"
           │
           ▼
┌─────────────────────┐
│   Loading State     │
│  "Enviando..."      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   POST /auth/       │
│ resend-verification │
└──────────┬──────────┘
           │
           ├──────────► Sucesso
           │            │
           │            ▼
           │      ┌──────────────┐
           │      │ Toast Verde  │
           │      │ "Email env." │
           │      └──────────────┘
           │
           └──────────► Erro
                        │
                        ▼
                  ┌──────────────┐
                  │ Toast Vermelho│
                  │ "Erro ao..." │
                  └──────────────┘
```

## Segurança e Rate Limiting

### Recomendações para o Backend:

1. **Rate Limiting**
   - Limite de 3 tentativas por hora
   - Retornar 429 Too Many Requests após limite

2. **Validações**
   - Verificar se o usuário está autenticado
   - Verificar se o email ainda não foi verificado
   - Registrar tentativas de reenvio no log

3. **Token de Verificação**
   - Gerar novo token a cada reenvio
   - Token com validade de 24 horas
   - Invalidar tokens anteriores

4. **Email**
   - Incluir link de verificação com token
   - Link deve apontar para `/auth/verify-email?token={token}`
   - Email deve ser user-friendly com instruções claras

## Exemplo de Email (Template)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verifique seu Email</title>
</head>
<body>
    <h1>Bem-vindo ao Wishlist!</h1>
    <p>Olá, {{userName}}!</p>
    <p>Para começar a usar sua conta, por favor, verifique seu email clicando no botão abaixo:</p>

    <a href="{{verificationLink}}" style="display: inline-block; padding: 12px 24px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 6px;">
        Verificar Email
    </a>

    <p>Ou copie e cole o link abaixo no seu navegador:</p>
    <p>{{verificationLink}}</p>

    <p>Este link expira em 24 horas.</p>

    <p>Se você não criou uma conta conosco, ignore este email.</p>

    <p>Atenciosamente,<br>Equipe Wishlist</p>
</body>
</html>
```

## Testes

### Teste Manual

1. **Teste 1: Email não verificado**
   - Fazer login com conta não verificada
   - Ir para página de perfil
   - Clicar em "Verificar agora"
   - Verificar se toast de sucesso aparece
   - Verificar se email foi recebido

2. **Teste 2: Rate limiting**
   - Clicar em "Verificar agora" múltiplas vezes
   - Verificar se backend retorna erro 429 após limite
   - Verificar se toast de erro é exibido

3. **Teste 3: Email já verificado**
   - Fazer login com conta verificada
   - Verificar que botão "Verificar agora" não aparece
   - Badge deve mostrar "Verificado" em verde

### Teste Automatizado (Exemplo)

```typescript
describe('Email Verification', () => {
  it('should send verification email when button is clicked', async () => {
    // Mock user with unverified email
    const user = { email: 'test@example.com', emailVerified: false };

    // Render profile page
    render(<ProfilePage />);

    // Find and click button
    const button = screen.getByText('Verificar agora');
    fireEvent.click(button);

    // Check loading state
    expect(screen.getByText('Enviando...')).toBeInTheDocument();

    // Wait for success toast
    await waitFor(() => {
      expect(screen.getByText('Email de verificação enviado!')).toBeInTheDocument();
    });
  });
});
```

## Logs Recomendados

O backend deve registrar:

```
INFO: Email verification resent to user {userId} ({email})
WARN: Rate limit exceeded for user {userId} attempting email verification
ERROR: Failed to send verification email to {email}: {error}
```

## Métricas Sugeridas

- Taxa de reenvios de email por dia
- Taxa de conversão (reenvio → verificação concluída)
- Tempo médio entre reenvio e verificação
- Número de tentativas bloqueadas por rate limiting

