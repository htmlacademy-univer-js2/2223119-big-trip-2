import { filters } from '../utils/filter';

function generateFilters(points) {
  return Object.entries(filters).map(
    ([filterName, filterTasks]) => ({
      name: filterName,
      count: filterTasks(points).length,
    }),
  );
}

export { generateFilters };
