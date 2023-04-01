import { createElement } from '../render.js';

const createListPointsTemplate = () => (
  `<ul class="trip-events__list">
   </ul>`
);


export default class ListPointsView {
  _getTemplate() {
    return createListPointsTemplate();
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
