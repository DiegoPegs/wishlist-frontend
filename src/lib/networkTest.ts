// Utilitário para testar conectividade de rede
export const testNetworkConnectivity = async () => {
  console.log('🔍 TESTANDO CONECTIVIDADE DE REDE...');

  // Teste 1: Verificar se conseguimos fazer fetch básico
  try {
    console.log('1️⃣ Testando fetch básico para http://localhost:3000...');
    const response = await fetch('http://localhost:3000', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Fetch básico funcionou:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return { success: true, method: 'fetch', status: response.status };
  } catch (error) {
    console.error('❌ Fetch básico falhou:', error);
  }

  // Teste 2: Verificar se conseguimos fazer fetch com OPTIONS (CORS preflight)
  try {
    console.log('2️⃣ Testando CORS preflight (OPTIONS)...');
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    console.log('✅ CORS preflight funcionou:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return { success: true, method: 'cors-preflight', status: response.status };
  } catch (error) {
    console.error('❌ CORS preflight falhou:', error);
  }

  // Teste 3: Verificar se conseguimos fazer POST real
  try {
    console.log('3️⃣ Testando POST real...');
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
    });

    console.log('✅ POST real funcionou:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    return { success: true, method: 'post', status: response.status };
  } catch (error) {
    console.error('❌ POST real falhou:', error);
  }

  console.error('❌ TODOS OS TESTES DE CONECTIVIDADE FALHARAM');
  return { success: false, method: 'none', status: 0 };
};

// Função para testar se o backend está rodando (usando fetch nativo)
export const testBackendRunning = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificando se backend está rodando...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('http://localhost:3000', {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('✅ Backend está rodando:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Backend não está rodando:', error);
    return false;
  }
};
