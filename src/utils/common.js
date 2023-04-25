import dayjs from 'dayjs';

function generateRandom(a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortByPrice(taskA, taskB) {
  return taskA.basePrice - taskB.basePrice;
}

function sortByTime(taskA, taskB) {
  return dayjs(taskA.startDate) - dayjs(taskB.startDate);
}

export { generateRandom, updateItem, sortByPrice, sortByTime };
