import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { FILTERS_TYPES } from '../utils/constants';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const filters = {
  [FILTERS_TYPES.everything]: (points) => points.filter((point) => point),
  [FILTERS_TYPES.future]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FILTERS_TYPES.past]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),

};

function generateFilters(points) {
  return Object.entries(filters).map(
    ([filterName, filterTasks]) => ({
      name: filterName,
      count: filterTasks(points).length,
    }),
  );
}

export { generateFilters };
