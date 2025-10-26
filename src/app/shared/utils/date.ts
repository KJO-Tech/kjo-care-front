export function formatDateToISO8601(date: string): string {
  let dateFormated = date.replace(' ', 'T');
  if (dateFormated.includes('Z')) {
    return dateFormated;
  } else {
    return dateFormated + 'Z';
  }
}
