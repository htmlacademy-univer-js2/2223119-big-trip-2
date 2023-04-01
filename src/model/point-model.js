import { generateRoute } from '../mock/route.js';

export default class RoutesModel {
  constructor() {
    this._ponts = Array.from({ length: 10 }, generateRoute);
  }

  get points() {
    return this._ponts;
  }
}
