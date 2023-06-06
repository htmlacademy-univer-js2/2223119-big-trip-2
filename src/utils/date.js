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

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export { DATE_FORMAT, humanizeDate, durationPoint, isDatesEqual };
