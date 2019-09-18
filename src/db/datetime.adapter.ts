export const datetime = (databaseType: string) => {
  return {
    sqlite: 'datetime',
    postgres: 'timestamp',
  }[databaseType];
};
