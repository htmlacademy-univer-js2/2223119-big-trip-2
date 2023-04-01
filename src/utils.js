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

const favoritePoint = (isFavorite) => (isFavorite) ? 'event__favorite-btn--active' : '';

function generateRandom(a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

export { humanizeDay, humanizeHour, calculateTime, favoritePoint, generateRandom };
