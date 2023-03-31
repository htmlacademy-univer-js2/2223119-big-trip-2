import { createElement } from '../render.js';

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
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
