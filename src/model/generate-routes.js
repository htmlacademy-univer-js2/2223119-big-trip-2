import { generateRoute } from '../mock/route.js';

export default class RoutesModel {
  constructor() {
    this._routes = Array.from({ length: 3 }, generateRoute);
  }

  get events() {
    return this._routes;
  }
}
