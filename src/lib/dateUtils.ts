// Utilitários para formatação de datas

interface BirthDate {
  day: number;
  month: number;
  year?: number;
}

// Nomes dos meses em português
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

/**
 * Formata uma data de nascimento para exibição
 * @param birthDate - Objeto com day, month e year opcional
 * @returns String formatada (ex: "05 de Janeiro" ou "05 de Janeiro de 1987")
 */
export function formatBirthDate(birthDate?: BirthDate): string {
  if (!birthDate) {
    return 'Não informada';
  }

  const { day, month, year } = birthDate;

  // Validar se os dados estão presentes
  if (!day || !month) {
    return 'Data inválida';
  }

  // Validar se o mês está no range válido (1-12)
  if (month < 1 || month > 12) {
    return 'Data inválida';
  }

  // Validar se o dia está no range válido (1-31)
  if (day < 1 || day > 31) {
    return 'Data inválida';
  }

  const monthName = monthNames[month - 1];

  if (year) {
    return `${day} de ${monthName} de ${year}`;
  } else {
    return `${day} de ${monthName}`;
  }
}

/**
 * Valida se uma data de nascimento é válida
 * @param birthDate - Objeto com day, month e year opcional
 * @returns true se a data é válida, false caso contrário
 */
export function isValidBirthDate(birthDate: BirthDate): boolean {
  const { day, month, year } = birthDate;

  // Validar mês (1-12)
  if (month < 1 || month > 12) return false;

  // Validar dia (1-31)
  if (day < 1 || day > 31) return false;

  // Se o ano estiver presente, validar se não é futuro
  if (year) {
    const currentYear = new Date().getFullYear();
    if (year > currentYear) return false;

    // Validar se a data existe (ex: 29/02 em ano não bissexto)
    const testDate = new Date(year, month - 1, day);
    return testDate.getDate() === day &&
           testDate.getMonth() === month - 1 &&
           testDate.getFullYear() === year;
  }

  return true;
}

/**
 * Converte uma data de nascimento para string no formato YYYY-MM-DD
 * @param birthDate - Objeto com day, month e year
 * @returns String no formato YYYY-MM-DD ou null se inválida
 */
export function birthDateToString(birthDate: BirthDate): string | null {
  const { day, month, year } = birthDate;

  if (!year || !isValidBirthDate(birthDate)) {
    return null;
  }

  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');

  return `${year}-${paddedMonth}-${paddedDay}`;
}
