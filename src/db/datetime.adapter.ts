export const datetime = (databaseType: string): string => {
  return {
    sqlite: 'datetime',
    postgres: 'timestamp',
  }[databaseType];
};
