import axios from 'axios';

// Instância base do Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autorização
api.interceptors.request.use(
  (config) => {
    // Log detalhado da requisição para debug
    console.log('🚀 FAZENDO REQUISIÇÃO:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      timeout: config.timeout,
    });

    // O token será obtido do store do Zustand
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token adicionado à requisição');
      } else {
        console.log('⚠️ Nenhum token encontrado no localStorage');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ ERRO NO INTERCEPTOR DE REQUEST:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ RESPOSTA RECEBIDA:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Log SUPER detalhado do erro para debug
    console.error('❌ ERRO DETALHADO:', {
      // Informações básicas do erro
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,

      // Informações da requisição
      request: {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        headers: error.config?.headers,
        timeout: error.config?.timeout,
        data: error.config?.data,
      },

      // Informações da resposta (se houver)
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
      } : null,

      // Informações de rede
      network: {
        isNetworkError: !error.response,
        isTimeout: error.code === 'ECONNABORTED',
        isConnectionRefused: error.code === 'ECONNREFUSED',
        isNetworkErrorCode: error.code === 'ERR_NETWORK',
        isCorsError: error.message?.includes('CORS') || error.message?.includes('cors'),
      }
    });

    // Diagnóstico específico de CORS
    if (error.message?.includes('CORS') || error.message?.includes('cors') ||
        error.message?.includes('Access-Control-Allow-Origin')) {
      console.error(`
🌐 PROBLEMA DE CORS DETECTADO!
O backend precisa configurar CORS para permitir requisições do frontend.

Soluções:
1. No backend, adicione middleware CORS:
   app.use(cors({
     origin: 'http://localhost:3001',
     credentials: true
   }));

2. Ou configure manualmente os headers:
   Access-Control-Allow-Origin: http://localhost:3001
   Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
   Access-Control-Allow-Headers: Content-Type,Authorization
      `);
    }

    // Diagnóstico de conexão
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error(`
🔌 PROBLEMA DE CONEXÃO!
O backend não está respondendo na porta 3000.

Soluções:
1. Verifique se o backend está rodando: curl http://localhost:3000
2. Confirme a porta: netstat -tulpn | grep :3000
3. Verifique firewall: sudo ufw status
4. Teste com Postman ou curl
      `);
    }

    // Diagnóstico de timeout
    if (error.code === 'ECONNABORTED') {
      console.error(`
⏰ TIMEOUT!
A requisição demorou mais de 10 segundos.

Soluções:
1. Verifique se o backend está processando lentamente
2. Aumente o timeout se necessário
3. Verifique logs do backend
      `);
    }

    // Se o token expirou ou é inválido, limpar o localStorage
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        console.log('🔑 Token inválido, redirecionando para login');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Suprimir erros de runtime.lastError (extensões do navegador)
// Esta verificação será feita apenas no cliente através de useEffect

export default api;
