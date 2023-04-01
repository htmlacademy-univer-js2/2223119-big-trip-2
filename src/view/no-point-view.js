import { createElement } from '../render.js';

const createNoPointTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);


export default class NoPointView {
  _getTemplate() {
    return createNoPointTemplate();
  }

  get element() {
    if (!this._element){
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
