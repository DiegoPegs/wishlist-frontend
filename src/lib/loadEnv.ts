// src/lib/loadEnv.ts
import {
  SSMClient,
  GetParametersByPathCommand,
  Parameter,
} from '@aws-sdk/client-ssm';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Carrega variáveis de ambiente do arquivo .env.local como fallback
 */
function getLocalEnvVars(): Record<string, string> {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');

    const envVars: Record<string, string> = {};

    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          envVars[key.trim()] = value.trim();
        }
      }
    });

    return envVars;
  } catch {
    // Se não conseguir ler o .env.local, retorna variáveis padrão
    return {
      NEXT_PUBLIC_API_URL: 'http://localhost:3000'
    };
  }
}

/**
 * Carrega variáveis de ambiente do AWS SSM Parameter Store com base no ambiente atual (NODE_ENV).
 * Se o SSM não estiver disponível, retorna as variáveis do .env.local
 */
export async function loadEnvFromSSM(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') {
    return {};
  }

  const environment = process.env.NODE_ENV || 'development';
  const ssmPath = `/app/kero-wishlist/${environment}/`;

  try {
    const client = new SSMClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });

    const command = new GetParametersByPathCommand({
      Path: ssmPath,
      Recursive: true,
      WithDecryption: true,
    });

    const response = await client.send(command);
    const parameters = response.Parameters || [];

    if (parameters.length === 0) {
      return getLocalEnvVars();
    }

    const envVars = parameters.reduce((acc: Record<string, string>, param: Parameter) => {
      if (param.Name && param.Value) {
        const key = param.Name.replace(ssmPath, '');
        acc[key] = param.Value;
      }
      return acc;
    }, {});

    return envVars;

  } catch {
    // Em desenvolvimento, usa variáveis locais como fallback
    if (process.env.NODE_ENV === 'development') {
      return getLocalEnvVars();
    }

    // Em produção, usa variáveis locais como fallback se AWS não estiver disponível
    if (process.env.NODE_ENV === 'production') {
      return getLocalEnvVars();
    }

    return getLocalEnvVars();
  }
}
