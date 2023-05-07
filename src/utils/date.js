import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DATE_FORMAT = {
  DATE : 'MMM D',
  MONTH : 'MMM',
  DAY : 'D',
  TIME : 'HH:mm',
  EDIT_DATE : 'DD/MM/YY'
};

function humanizeDate(dueDate, dateFormat) {
  return dueDate ? dayjs(dueDate).format(dateFormat) : '';
}

function durationPoint(dateFrom, dateTo){
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  const dayResult = to.diff(from, 'day');
  const hourResult = to.diff(from, 'hour');
  const minuteResult = to.diff(from, 'minute');

  if (dayResult){
    return (
      `${ dayResult }D ${ Math.round(hourResult / 24) }H ${ Math.round(minuteResult / 24 * 60) }M`
    );

  } else if (hourResult){
    return(
      `${ hourResult }H ${ Math.round(minuteResult / 24) }M`
    );
  } else {
    return(
      `${ minuteResult }M`
    );
  }
}

function SortDay(valueA, valueB) {
  return valueA - valueB;
}

function sortTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return SortDay(timeA, timeB);
}

function sortPrice(pointA, pointB) {
  const weight = SortDay(pointA.basePrice, pointB.basePrice);

  return weight;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export { DATE_FORMAT, humanizeDate, durationPoint, SortDay, sortTime, sortPrice, isDatesEqual };
