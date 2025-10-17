import { format, parseISO, isValid, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma string de data ISO para o formato "dd/MM/yyyy"
 * @param dateString - String de data no formato ISO
 * @returns String formatada como "dd/MM/yyyy" ou "Data inválida" se a entrada for inválida
 */
export function formatDate(dateString?: string): string {
  if (!dateString) {
    return 'Data inválida';
  }

  try {
    const date = parseISO(dateString);

    if (!isValid(date)) {
      return 'Data inválida';
    }

    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

/**
 * Formata um objeto de data de nascimento para o formato "DD de MMMM de YYYY" ou "DD de MMMM"
 * @param birthDate - Objeto com day, month e year opcionais
 * @returns String formatada ou "Não informado" se não existir
 */
export function formatBirthDateObject(birthDate?: { day?: number, month?: number, year?: number }): string {
  if (!birthDate || !birthDate.day || !birthDate.month) {
    return 'Não informado';
  }

  try {
    // Criar uma data válida (usar ano atual se não fornecido)
    const year = birthDate.year || new Date().getFullYear();
    const date = new Date(year, birthDate.month - 1, birthDate.day); // month é 0-indexed no Date

    if (!isValid(date)) {
      return 'Não informado';
    }

    // Se não tem ano, mostrar apenas dia e mês
    if (!birthDate.year) {
      return format(date, 'dd \'de\' MMMM', { locale: ptBR });
    }

    // Se tem ano, mostrar dia, mês e ano
    return format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data de nascimento:', error);
    return 'Não informado';
  }
}

/**
 * Calcula a idade a partir de um objeto de data de nascimento
 * @param birthDate - Objeto com day, month e year opcionais
 * @returns Idade em anos ou null se não for possível calcular
 */
export function calculateAge(birthDate?: { day?: number, month?: number, year?: number }): number | null {
  if (!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) {
    return null;
  }

  try {
    const birthDateObj = new Date(birthDate.year, birthDate.month - 1, birthDate.day); // month é 0-indexed no Date
    const today = new Date();

    if (!isValid(birthDateObj)) {
      return null;
    }

    const age = differenceInYears(today, birthDateObj);
    return age >= 0 ? age : null;
  } catch (error) {
    console.error('Erro ao calcular idade:', error);
    return null;
  }
}