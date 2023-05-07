import dayjs from 'dayjs';

function sortDay(valueA, valueB) {
  return valueA - valueB;
}

function sortTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return sortDay(timeA, timeB);
}

function sortPrice(pointA, pointB) {
  const weight = sortDay(pointA.basePrice, pointB.basePrice);

  return weight;
}

export { sortDay, sortTime, sortPrice };
