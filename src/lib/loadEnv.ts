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

    console.log(`✅ Carregadas ${Object.keys(envVars).length} variáveis do .env.local`);
    return envVars;
  } catch (error) {
    console.warn('⚠️ Arquivo .env.local não encontrado ou erro ao ler:', error);
    return {};
  }
}

/**
 * Carrega variáveis de ambiente do AWS SSM Parameter Store com base no ambiente atual (NODE_ENV).
 * Se o SSM não estiver disponível, retorna as variáveis do .env.local
 */
export async function loadEnvFromSSM(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') {
    console.log('Skipping SSM fetch on client-side.');
    return {};
  }

  const environment = process.env.NODE_ENV || 'development';
  const ssmPath = `/app/kero-wishlist/${environment}/`;

  console.log(`Buscando variáveis de ambiente do SSM para o ambiente: "${environment}"`);
  console.log(`Caminho no SSM: ${ssmPath}`);
  console.log(`AWS Profile: ${process.env.AWS_PROFILE || 'default'}`);
  console.log(`AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);

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
      console.warn(`⚠️ Nenhuma variável de ambiente encontrada no SSM para o caminho: ${ssmPath}`);
      console.log('🔄 Tentando usar variáveis do .env.local...');
      return getLocalEnvVars();
    }

    const envVars = parameters.reduce((acc: Record<string, string>, param: Parameter) => {
      if (param.Name && param.Value) {
        const key = param.Name.replace(ssmPath, '');
        acc[key] = param.Value;
      }
      return acc;
    }, {});

    console.log('✅ Variáveis de ambiente carregadas do SSM com sucesso!');
    return envVars;

  } catch (error) {
    console.error('❌ Falha ao carregar variáveis do SSM:', error);
    console.log('🔄 Tentando usar variáveis do .env.local...');

    // Em desenvolvimento, usa variáveis locais como fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Continuando em modo desenvolvimento usando .env.local');
      return getLocalEnvVars();
    }

    // Em produção, falha apenas se for um erro crítico de configuração
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Erro crítico em produção - verificando tipo de erro...');

      // Se for erro de credenciais, permissões ou assinatura, usa variáveis locais
      if (error instanceof Error && (
        error.message.includes('security token') ||
        error.message.includes('AccessDenied') ||
        error.message.includes('UnauthorizedOperation') ||
        error.message.includes('InvalidSignature') ||
        error.message.includes('SignatureDoesNotMatch')
      )) {
        console.warn('⚠️ Problema de credenciais/permissões AWS, usando .env.local...');
        return getLocalEnvVars();
      }

      throw new Error('Não foi possível carregar as configurações da AWS em produção. Abortando o build.');
    }

    return getLocalEnvVars();
  }
}
