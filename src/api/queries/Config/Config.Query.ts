export const isValidId = (id: string | number | undefined): id is string | number => {
  if (id === undefined || id === null) return false;
  if (typeof id === 'string') return id.trim().length > 0;
  if (typeof id === 'number') return id > 0 && !isNaN(id);
  return false;
};


export const defaultRetryConfig = {
  retry: 3, // Máximo 3 reintentos
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000), // 1s, 2s, 4s, máximo 10s
}