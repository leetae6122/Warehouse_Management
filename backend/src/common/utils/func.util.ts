export const normalizeStringDto = ({ value }: { value: string }) =>
  value.trim().replace(/ +/g, ' ');
