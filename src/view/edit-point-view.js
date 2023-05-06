import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DESTINATION, OFFERS, OFFERS_BY_TYPE } from '../mock/point.js';
import { POINTS_TYPES } from '../utils/constants.js';
import { humanizeDay, humanizeHour } from '../utils/date.js';
import { generateRandom } from '../utils/common.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: generateRandom(100, 110),
  dateFrom: '2019-03-18T12:25:56.000',
  dateTo: '2019-03-09T13:35:13.000',
  destination: DESTINATION[generateRandom(0, DESTINATION.length - 1)],
  city: 'Moscow',
  id: '0',
  offers: OFFERS[generateRandom(0, OFFERS.length - 1)],
  type: POINTS_TYPES[generateRandom(0, POINTS_TYPES.length - 1)],
  img: DESTINATION[generateRandom(0, DESTINATION.length - 1)].pictures[0].src
};

function returnDestanition(city){
  const destanitionCity = DESTINATION.filter((item) => item.name === city);
  return destanitionCity[0];
}

function returnThisOffer(offer) {
  const offerCurrentArray = OFFERS_BY_TYPE.map(({offers}) => offers.filter((item) => item.title.toLowerCase() === offer.toLowerCase()));
  const offerCurrent = offerCurrentArray.filter((item) => item.length);
  return offerCurrent[0][0];
}

function createDestionations() {
  const destinations = DESTINATION.map(({name}) => name);
  return destinations.map((destination) =>
    (`<option value="${ destination.name }"></option>\n`).join(''));
}

const createAvailable = (offers, event) => {
  const availableOffers = OFFERS_BY_TYPE.find((item) => (item.type === event)).offers;
  let offerOptions = '';

  for (const offerId of availableOffers) {
    for (const offer of offers) {
      if (offerId === offer.id) {
        offerOptions = offerOptions.concat(`<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-1" type="checkbox" name="event-offer-${offer.title.split(' ').pop()}">
          <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-1">
            <span class="event__offer-title">${ offer.title }</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${ offer.price }</span>
          </label>
        </div>\n`);
      }
    }
  }

  return offerOptions;
};

function createDestinationTemplate(destination) {
  const currentDestinition = returnDestanition(destination);
  const photosTape = currentDestinition === undefined ? '' : `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${currentDestinition.pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`)}
      </div>
    </div>
  `;
  return (currentDestinition ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestinition.description}</p>
      ${photosTape}
    </section>
  ` : '');
}

const createEditPointTemplate = (point) => {
  const{ basePrice, dateFrom, dateTo, destination, type } = point;

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    <div class="event__type-item">
                      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                      <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                      <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                      <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                    </div>
                    <div class="event__type-item">
                      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                ${type}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${ type }" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${ createDestionations }
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ humanizeDay(dateFrom) } ${ humanizeHour(dateFrom) }">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ humanizeDay(dateTo) } ${ humanizeHour(dateTo) }">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>

            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                ${ createAvailable(OFFERS, type) }
                </div>
              </section>

              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${ createDestinationTemplate(destination) }</p>
              </section>
            </section>
          </form>`;
};


export default class EditPointView extends AbstractStatefulView {
  #handleCloseEditClick = null;
  #handleSaveClick = null;
  #handleDeleteClick = null;

  #datepicker = null;

  constructor({point = BLANK_POINT, onCloseEditClick, onSaveClick, onDeleteClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#handleSaveClick = onSaveClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCloseEditClick = onCloseEditClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point){
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__save-btn')
      .addEventListener('submit', this.#formSaveHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);

    this.#setDatepicker();
  };

  #formSaveHandler = (evt) => {
    evt.preventDefault();
    this.#handleSaveClick(EditPointView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditClick();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const parsedPrice = parseInt(evt.target.value, 10);
    evt.target.value = isNaN(parsedPrice) ? this._state.basePrice : parsedPrice;
    this._setState({ basePrice: parseInt(evt.target.value, 10) });
  };

  #destinationChangeHandler = (evt) => {
    const destination = returnDestanition(evt.target.value);
    if (destination === undefined) {
      this.reset(this._state);
    } else {
      this.updateElement({ destination: destination.name });
    }
  };

  #offerChangeHandler = (evt) => {
    let selectedOffers = this._state.offers;
    const offer = returnThisOffer(evt.target.dataset.offer);
    if (evt.target.checked) {
      selectedOffers.push(offer);
      selectedOffers.sort();
    } else {
      selectedOffers = this._state.offers.filter((e) => e.title.toLowerCase() !== offer.title.toLowerCase());
    }
    this._setState({ offers: selectedOffers });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    if (this._state.isDueDate) {
      this.#datepicker.from = flatpickr(
        this.element.querySelector('#event-start-time'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#dateFromChangeHandler,
        },
      );
      this.#datepicker.to = flatpickr(
        this.element.querySelector('#event-end-time'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#dateToChangeHandler,
        }
      );
    }
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return { ...state};
  }
}
