import { render } from '../render';
import FormCreationView from '../view/form-creation';
import FormEditingView from '../view/form-editing';
import RoutePointView from '../view/route-point';
import SortingView from '../view/sorting';
import ListTripsView from '../view/list_trips';

export default class RenderingComponents {
  constructor(container) {
    this.container = container;
    this.component = new ListTripsView();
  }

  init() {
    render(new SortingView(), this.container);
    render(this.component, this.container);
    render(new FormEditingView(), this.component.getElement());
    render(new FormCreationView(), this.component.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.component.getElement());
    }
  }
}
