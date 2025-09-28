#!/bin/bash
# start-mcp.sh - Script para iniciar Chrome DevTools MCP

echo "🚀 Iniciando Chrome DevTools MCP..."

# Verificar se Chrome está instalado
if ! command -v google-chrome &> /dev/null; then
    echo "❌ Google Chrome não encontrado. Instalando..."
    # Instalar Chrome (Ubuntu/Debian)
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt-get update
    sudo apt-get install -y google-chrome-stable
fi

# Verificar se a porta 9222 está livre
if lsof -i :9222 &> /dev/null; then
    echo "⚠️  Porta 9222 já está em uso. Matando processos..."
    pkill -f "chrome.*9222" || true
    pkill -f "chrome-devtools-mcp" || true
    sleep 2
fi

# Iniciar Chrome em modo debug
echo "🌐 Iniciando Chrome em modo debug..."
google-chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --disable-web-security --disable-features=VizDisplayCompositor &
CHROME_PID=$!

# Aguardar Chrome inicializar
echo "⏳ Aguardando Chrome inicializar..."
sleep 5

# Verificar se Chrome está rodando
if ! ps -p $CHROME_PID > /dev/null; then
    echo "❌ Falha ao iniciar Chrome"
    exit 1
fi

# Iniciar servidor MCP
echo "🔧 Iniciando servidor MCP..."
npx chrome-devtools-mcp --browserUrl http://127.0.0.1:9222 &
MCP_PID=$!

# Aguardar MCP inicializar
sleep 3

echo "✅ Chrome PID: $CHROME_PID"
echo "✅ MCP PID: $MCP_PID"
echo "🌐 Chrome DevTools: http://localhost:9222"
echo "🔧 MCP Server: Conectado"
echo ""
echo "📋 Para testar a conexão:"
echo "   curl http://localhost:9222/json/version"
echo ""
echo "🛑 Para parar: Ctrl+C"

# Função de cleanup
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $CHROME_PID 2>/dev/null || true
    kill $MCP_PID 2>/dev/null || true
    pkill -f "chrome.*9222" 2>/dev/null || true
    pkill -f "chrome-devtools-mcp" 2>/dev/null || true
    echo "✅ Serviços parados"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Manter script rodando
wait
