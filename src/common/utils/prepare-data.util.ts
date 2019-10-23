export function prepareDate(data: Date): string {
  return data.toISOString().split('.')[0];
}
