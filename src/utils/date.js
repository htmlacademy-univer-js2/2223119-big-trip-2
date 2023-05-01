import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const humanizeDay = (pointDate) => pointDate ? dayjs(pointDate).format('MMM D') : '';
const humanizeHour = (pointDate) => pointDate ? dayjs(pointDate).format('HH:mm') : '';

const calculateTime = (startDate, endDate) => {
  const dateFrom = dayjs(startDate);
  const dateTo = dayjs(endDate);

  const diffInTotalMinutes = Math.ceil(dateTo.diff(dateFrom, 'minute', true));
  const diffInHours = Math.floor(diffInTotalMinutes / 60) % 24;
  const diffInDays = Math.floor(diffInTotalMinutes / (60 * 24));

  if ((diffInDays === 0) && (diffInHours === 0)) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('mm[M]');
  } else if (diffInDays === 0) {
    return dayjs.duration(diffInTotalMinutes, 'minutes').format('HH[H] mm[M]');
  }
  return dayjs.duration(diffInTotalMinutes, 'minutes').format('DD[D] HH[H] mm[M]');
};

function getSortUp(valueA, valueB) {
  return valueA - valueB;
}

function sortTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return getSortUp(timeA, timeB);
}

function sortPrice(pointA, pointB) {
  const weight = getSortUp(pointA.basePrice, pointB.basePrice);

  return weight;
}


export { humanizeDay, humanizeHour, calculateTime, sortTime, sortPrice };
