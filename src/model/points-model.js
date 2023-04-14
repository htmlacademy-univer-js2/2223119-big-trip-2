import { generateRoute } from '../mock/point.js';

export default class PointsModel {
  #points;

  constructor() {
    this.#points = Array.from({ length: 10 }, generateRoute);
  }

  get points() {
    return this.#points;
  }
}
