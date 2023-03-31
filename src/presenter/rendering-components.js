import { render } from '../render.js';
import FormCreationView from '../view/form-creation.js';
import FormEditingView from '../view/form-editing.js';
import RoutePointView from '../view/route-point.js';
import SortingView from '../view/sorting.js';
import ListTripsView from '../view/list-trips.js';
import RoutesModel from '../model/generate-routes.js';

export default class RenderingComponents {
  constructor() {
    this.container = null;
    this.listTrips = new ListTripsView();
    this.eventsModel = null;
  }

  init(container) {
    this.container = container;
    this.eventsModel = new RoutesModel();
    this.events = [...this.eventsModel.events];

    render(new SortingView(), this.container);
    render(this.listTrips, this.container);
    render(new FormEditingView(this.events[0]), this.listTrips.getElement());
    render(new FormCreationView(), this.listTrips.getElement());

    this.events.forEach((event) => render(new RoutePointView(event), this.listTrips.getElement()));
  }
}
