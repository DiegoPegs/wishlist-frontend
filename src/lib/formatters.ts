import { format, parseISO, isValid } from 'date-fns';

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