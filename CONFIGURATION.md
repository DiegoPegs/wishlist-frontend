# Configuração do Projeto

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Frontend Configuration
# O frontend roda na porta 3001 e se comunica com a API na porta 3000
```

**Importante**:
- **Frontend**: Roda na porta 3001 (`http://localhost:3001`)
- **Backend API**: Deve rodar na porta 3000 (`http://localhost:3000`)

## Configuração da API Backend

1. Configure sua API backend para rodar na porta 3000
2. Certifique-se de que os endpoints de autenticação estão implementados:
   - `POST /auth/register`
   - `POST /auth/login`
   - `POST /auth/logout`
   - `POST /auth/change-password`
   - `POST /auth/forgot-password`
   - `POST /auth/reset-password`
   - `GET /users/me`

## Estrutura do Projeto

```
src/
├── app/                    # Rotas do Next.js
│   ├── login/             # Página de login
│   ├── register/          # Página de cadastro
│   ├── forgot-password/   # Página de recuperação de senha
│   ├── dashboard/         # Dashboard protegido
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizáveis
│   ├── AuthProvider.tsx   # Provider de autenticação
│   └── ProtectedRoute.tsx # Componente para rotas protegidas
├── lib/                   # Utilitários e serviços
│   ├── api.ts            # Cliente Axios
│   └── cognito.ts        # Serviço Cognito
├── store/                 # Gerenciamento de estado
│   └── auth.store.ts     # Store Zustand para autenticação
└── types/                 # Definições TypeScript
    └── auth.ts           # Tipos de autenticação
```

## Funcionalidades Implementadas

- ✅ Estrutura de pastas organizada
- ✅ Configuração do Tailwind CSS com tema personalizado
- ✅ Cliente de API com Axios e interceptors
- ✅ Store Zustand para gerenciamento de estado
- ✅ Serviço Cognito para autenticação
- ✅ AuthProvider para inicialização da autenticação
- ✅ Páginas de autenticação (login, registro, esqueci senha)
- ✅ Rotas protegidas
- ✅ Dashboard básico
- ✅ Página inicial com redirecionamento
- ✅ Páginas de criação de listas de desejos

## Próximos Passos

1. **Configure a API backend na porta 3000**
2. **Crie o arquivo `.env.local`** (opcional, mas recomendado):
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
   ```
3. **Execute o frontend**: `npm run dev`
4. **Acesse**: `http://localhost:3001`
5. **Teste o fluxo de autenticação**
6. **Implemente funcionalidades adicionais do dashboard**

## Resolução de Problemas

### Erro `runtime.lastError`
Este erro é causado por extensões do navegador (React DevTools, Redux DevTools, etc.) e foi suprimido automaticamente. Não afeta o funcionamento da aplicação.

### URLs dos Endpoints
- **Frontend**: `http://localhost:3001`
- **Backend**: `http://localhost:3000` (sem `/api`)
- **Endpoints de autenticação**:
  - `POST http://localhost:3000/auth/register`
  - `POST http://localhost:3000/auth/login` (aceita email ou username)
  - `POST http://localhost:3000/auth/logout`
  - `POST http://localhost:3000/auth/change-password`
  - `POST http://localhost:3000/auth/forgot-password`
  - `POST http://localhost:3000/auth/reset-password`
  - `GET http://localhost:3000/users/me`

### Formato de Login
O endpoint de login aceita tanto email quanto username no campo `login`:
```json
{
  "login": "usuario@email.com", // ou "nomeusuario"
  "password": "senha123"
}
```
