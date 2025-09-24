'use client';

import { useState } from 'react';
import { testBackendConnection, testEndpoint } from '@/lib/testConnection';
import { testNetworkConnectivity, testBackendRunning } from '@/lib/networkTest';

export function DebugConnection() {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<Array<{ test: string; result: boolean | { success: boolean; data?: unknown; error?: string } }>>([]);

  const testConnection = async () => {
    setIsTesting(true);
    setResults([]);

    const newResults = [];

    // Teste 1: Backend rodando (fetch nativo)
    newResults.push({
      test: 'Backend rodando (fetch)',
      result: await testBackendRunning(),
    });

    // Teste 2: Conectividade de rede (CORS, etc)
    const networkResult = await testNetworkConnectivity();
    newResults.push({
      test: 'Conectividade de rede',
      result: networkResult.success,
    });

    // Teste 3: Conexão via Axios
    newResults.push({
      test: 'Conexão Axios',
      result: await testBackendConnection(),
    });

    // Teste 4: Endpoint de health (se existir)
    newResults.push({
      test: 'Endpoint /health',
      result: await testEndpoint('/health'),
    });

    // Teste 5: Endpoint de login (sem dados)
    newResults.push({
      test: 'Endpoint /auth/login',
      result: await testEndpoint('/auth/login', 'POST', {}),
    });

    setResults(newResults);
    setIsTesting(false);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Só mostra em desenvolvimento
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="font-bold text-sm mb-2">🔧 Debug de Conexão</h3>

      <button
        onClick={testConnection}
        disabled={isTesting}
        className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        {isTesting ? 'Testando...' : 'Testar Conexão'}
      </button>

      {results.length > 0 && (
        <div className="mt-3 space-y-1">
          {results.map((result, index) => (
            <div key={index} className="text-xs">
              <span className={result.result ? 'text-green-600' : 'text-red-600'}>
                {result.result ? '✅' : '❌'}
              </span>
              <span className="ml-1">{result.test}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        <p>Backend esperado: http://localhost:3000</p>
        <p>Frontend: http://localhost:3001</p>
      </div>
    </div>
  );
}
