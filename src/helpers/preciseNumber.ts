export const preciseData = (data, precision = 0) => {
  return data ? Number(data).toFixed(precision) : data;
};
