export const formatValue = (values: Record<string, boolean>) => {
  const result: string[] = [];
  Object.keys(values).forEach((key: string) => {
    if (values[key]) {
      result.push(key);
    }
  });
  return result;
};
