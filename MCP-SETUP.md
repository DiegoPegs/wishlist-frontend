# Chrome DevTools MCP Setup

Este projeto está configurado para usar o Chrome DevTools MCP (Model Context Protocol) com o Cursor.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar tudo de uma vez
```bash
npm run dev:full
```

### 3. Ou iniciar separadamente
```bash
# Terminal 1: Aplicação Next.js
npm run dev

# Terminal 2: Chrome com debug
npm run dev:chrome

# Terminal 3: Servidor MCP
npm run dev:mcp
```

## 🔧 Scripts Disponíveis

- `npm run dev:mcp` - Inicia apenas o servidor MCP
- `npm run dev:chrome` - Inicia Chrome em modo debug
- `npm run dev:full` - Inicia tudo simultaneamente
- `npm run mcp:start` - Script completo de inicialização
- `npm run mcp:test` - Testa se o MCP está funcionando

## 📁 Arquivos de Configuração

- `.vscode/settings.json` - Configurações do Cursor para MCP
- `.vscode/launch.json` - Configurações de debug
- `.vscode/tasks.json` - Tarefas automatizadas
- `mcp-config.json` - Configuração do servidor MCP
- `scripts/start-mcp.sh` - Script de inicialização completo
- `scripts/start-chrome.js` - Script Node.js para Chrome

## 🌐 URLs Importantes

- **Aplicação**: http://localhost:3001
- **Chrome DevTools**: http://localhost:9222
- **MCP Server**: Conectado automaticamente

## 🧪 Testando a Conexão

```bash
# Verificar se Chrome está rodando
curl http://localhost:9222/json/version

# Verificar processos
ps aux | grep chrome
ps aux | grep chrome-devtools-mcp
```

## 🛠️ Troubleshooting

### Chrome não inicia
```bash
# Instalar Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

### Porta 9222 ocupada
```bash
# Matar processos na porta
sudo lsof -i :9222
sudo kill -9 <PID>
```

### MCP não conecta
1. Verificar se Chrome está rodando em modo debug
2. Verificar se o servidor MCP está ativo
3. Reiniciar o Cursor
4. Verificar logs no terminal

## 📋 Comandos MCP no Cursor

Após configurar, você pode usar comandos como:
- "Take a screenshot of the current page"
- "Click on the login button"
- "Get the page title"
- "Navigate to http://localhost:3001"
- "Fill the form with test data"
