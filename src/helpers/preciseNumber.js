export function preciseData(data, precision) {
  return data ? Number(data.toFixed(precision)) : data;
}
