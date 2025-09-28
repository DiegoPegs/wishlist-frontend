import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para o formato brasileiro dd/MM/yyyy
 * @param dateString - String da data no formato ISO ou Date
 * @returns String formatada no formato dd/MM/yyyy
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  try {
    // Verificar se a data existe
    if (!dateString) {
      return 'Data inválida';
    }

    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

/**
 * Formata uma data para o formato brasileiro com hora dd/MM/yyyy HH:mm
 * @param dateString - String da data no formato ISO ou Date
 * @returns String formatada no formato dd/MM/yyyy HH:mm
 */
export function formatDateTime(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return 'Data inválida';
  }
}

/**
 * Formata uma data para o formato brasileiro longo (ex: 15 de maio de 2024)
 * @param dateString - String da data no formato ISO ou Date
 * @returns String formatada no formato longo
 */
export function formatDateLong(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data longa:', error);
    return 'Data inválida';
  }
}
