import dayjs from 'dayjs';

function sortDay(pointA, pointB) {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
}

function sortTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timeA - timeB;
}

function sortPrice(pointA, pointB) {
  const weight = pointA.basePrice - pointB.basePrice;

  return weight;
}

export { sortDay, sortTime, sortPrice };
