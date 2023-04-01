import { createElement } from '../render.js';
import { APPOINTMENTS, OFFERS } from '../mock/route.js';
import { humanizeDay, humanizeHour, calculateTime, favoritePoint } from '../utils.js';

const createOffer = (offers) =>
  offers.reduce((result, offer) => {
    const offerInfo = OFFERS.find((item) => item.id === offer);
    return result.concat(
      `<li class="event__offer">
        <span class="event__offer-title">${ offerInfo.title }</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${ offerInfo.price }</span>
      </li>\n`);
  }, '');

const createOffersList = (offers) =>
  offers.length > 0
    ? `<ul class="event__selected-offers">
        ${ createOffer(offers) }
      </ul>`
    : '';

const createPointTemplate = (point) => {
  const { basePrice, destination, startDate, endDate, isFavorite, offers, type } = point;
  const name = APPOINTMENTS.find((item) => (item.id === destination)).name;

  return `<li class="trip-events__item">
        <div class="event">
        <time class="event__date" datetime="${ humanizeDay(startDate) }">${ humanizeDay(startDate) }</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/sightseeing.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${ type } ${ name }</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${ humanizeHour(startDate) }">${ humanizeHour(startDate) }</time>
            &mdash;
            <time class="event__end-time" datetime="${ humanizeHour(endDate) }">${ humanizeHour(endDate) }</time>
          </p>
          <p class="event__duration">${ calculateTime(startDate, endDate) }</p>
        </div>
          &euro;&nbsp;<span class="event__price">${ basePrice }</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${ createOffersList(offers) }
        <button class="event__favorite-btn ${ favoritePoint(isFavorite) }" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>\
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
        </div>
      </li>`;
};

export default class PointView {
  constructor(point) {
    this._point = point;
  }

  _getTemplate() {
    return this._element;
  }

  get element() {
    if (!this._element){
      this._element = createElement(createPointTemplate(this._point));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
