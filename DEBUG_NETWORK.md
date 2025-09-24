# 🔧 Guia de Diagnóstico de Problemas de Rede

## 🚀 Como Usar

1. **Execute o frontend**: `npm run dev`
2. **Abra o console do navegador** (F12)
3. **Use o botão de debug** no canto inferior direito
4. **Analise os logs detalhados**

## 🔍 Logs Detalhados Implementados

### Logs de Requisição
- ✅ URL completa da requisição
- ✅ Headers enviados
- ✅ Timeout configurado
- ✅ Token de autenticação (se disponível)

### Logs de Resposta
- ✅ Status da resposta
- ✅ Headers recebidos
- ✅ Dados da resposta

### Logs de Erro
- ✅ Código do erro
- ✅ Stack trace completo
- ✅ Informações de rede
- ✅ Diagnóstico automático de CORS
- ✅ Diagnóstico de conexão
- ✅ Diagnóstico de timeout

## 🌐 Problemas Comuns e Soluções

### 1. Erro de CORS
**Sintomas**: Erro no console mencionando CORS ou Access-Control-Allow-Origin

**Soluções**:
```javascript
// No seu backend (Node.js/Express)
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Backend Não Está Rodando
**Sintomas**: ECONNREFUSED ou ERR_NETWORK

**Soluções**:
```bash
# Verificar se a porta 3000 está em uso
netstat -tulpn | grep :3000

# Testar com curl
curl http://localhost:3000

# Verificar logs do backend
# (depende da sua implementação)
```

### 3. Timeout
**Sintomas**: ECONNABORTED

**Soluções**:
- Verificar se o backend está processando lentamente
- Aumentar timeout no frontend (atualmente 10s)
- Verificar logs do backend

### 4. Problema de Headers
**Sintomas**: 400 Bad Request ou erro de validação

**Soluções**:
- Verificar se Content-Type está correto
- Verificar se Authorization header está sendo enviado
- Verificar se o backend espera os headers corretos

## 🧪 Testes Automáticos

O sistema agora inclui testes automáticos para:

1. **Backend rodando** (fetch nativo)
2. **Conectividade de rede** (CORS, preflight)
3. **Conexão Axios** (com interceptors)
4. **Endpoint /health** (se existir)
5. **Endpoint /auth/login** (teste real)

## 📋 Checklist de Diagnóstico

- [ ] Backend está rodando na porta 3000?
- [ ] Frontend está rodando na porta 3001?
- [ ] CORS está configurado no backend?
- [ ] Headers estão corretos?
- [ ] Timeout é suficiente?
- [ ] Firewall não está bloqueando?
- [ ] URLs estão corretas (sem /api)?

## 🔧 Comandos Úteis

```bash
# Testar backend
curl http://localhost:3000

# Testar endpoint específico
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Verificar firewall (Ubuntu/Debian)
sudo ufw status
```

## 📞 Próximos Passos

1. Execute o frontend e verifique os logs
2. Use o componente de debug para testar
3. Se ainda houver erro, copie os logs do console
4. Verifique se o backend está configurado corretamente
