import { createElement } from '../render';

const createListTripsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);


export default class ListTripsView {
  getTemplate() {
    return createListTripsTemplate();
  }

  getElement() {
    if (!this.element) {
      return createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
