import api from './api';

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('Testando conexão com o backend...');

    // Tentar fazer uma requisição simples para testar a conectividade
    const response = await api.get('/health', { timeout: 5000 });

    console.log('✅ Backend conectado com sucesso:', response.status);
    return true;
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    console.error('❌ Erro ao conectar com o backend:', {
      message: err.message || 'Erro desconhecido',
      code: err.code,
      status: err.response?.status,
    });

    // Sugestões de solução
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
      console.error(`
🔧 Possíveis soluções:
1. Verifique se o backend está rodando na porta 3000
2. Execute: curl http://localhost:3000/health
3. Verifique se não há firewall bloqueando a porta
4. Confirme se a URL está correta: http://localhost:3000
      `);
    }

    return false;
  }
};

// Função para testar endpoint específico
export const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET', data?: unknown) => {
  try {
    console.log(`Testando endpoint: ${method} ${endpoint}`);

    let response;
    if (method === 'GET') {
      response = await api.get(endpoint);
    } else {
      response = await api.post(endpoint, data);
    }

    console.log(`✅ Endpoint ${endpoint} funcionando:`, response.status);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    console.error(`❌ Erro no endpoint ${endpoint}:`, {
      message: err.message || 'Erro desconhecido',
      code: err.code,
      status: err.response?.status,
    });
    return { success: false, error: err.message || 'Erro desconhecido' };
  }
};
