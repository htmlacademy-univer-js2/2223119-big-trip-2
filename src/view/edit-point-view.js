import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DATE_FORMAT, humanizeDate } from '../utils/date.js';
import { returnDestanition } from '../utils/point-inf.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 1000,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

function createOfferTypes(allOffers) {
  const allTypes = allOffers.map(({ type }) => type);
  return allTypes.map((offerType, index) =>
    `
      <div class="event__type-item">
        <input
          id="event-type-${ offerType }-${ index }"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${ offerType }">
        <label class="event__type-label  event__type-label--${ offerType }" for="event-type-${ offerType }-${ index }">${ offerType }</label>
      </div>
    `
  ).join('');
}

function createListCities(allDestinations) {
  const allCities = allDestinations.map(({name}) => name);
  return allCities.map((city) =>
    `<option value="${ city }"></option>`
  ).join('');
}

function createOffers(pointType, offers, allOffers) {
  const allOffersForType = allOffers.find((point) => point.type === pointType).offers;

  function isOfferSelected(offer) {
    if(offers) {
      return offers.find((currentOffer) => currentOffer === offer.id);
    } return '';
  }

  return (
    `${allOffersForType.map((offer) =>
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${ offer.title.split(' ').pop() }-${ offer.id }"
          type="checkbox"
          name="event-offer-luggage"
          ${ isOfferSelected(offer) ? 'checked' : ''}
          data-type="${ pointType }"
          data-offer-id="${ offer.id }">
        <label class="event__offer-label" for="event-offer-${ offer.title.split(' ').pop() }-${ offer.id }">
          <span class="event__offer-title">${ offer.title }</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${ offer.price }</span>
        </label>
      </div>`
    ).join('')}`
  );
}

function createDestinationTemplate(destination, allDestinations) {
  const currentDestinition = returnDestanition(destination, allDestinations);
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

const createEditPointTemplate = (point, allOffers, allDestinations) => {
  const{ basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving, isDeleting} = point;

  const offerTypes = createOfferTypes(allOffers);
  const cityList = createListCities(allDestinations);
  const showOffers = createOffers(type, offers, allOffers);
  const destinationInfo = createDestinationTemplate(destination, allDestinations);
  const city = returnDestanition(destination, allDestinations) ? returnDestanition(destination, allDestinations).name : '';

  const deleting = isDeleting ? 'Deleting...' : 'Delete';

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${ offerTypes }
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${ type }
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${ city }" list="destination-1" ${isDisabled ? 'disabled' : ''}>
                <datalist id="destination-1">
                  ${ cityList }
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ humanizeDate(dateFrom, DATE_FORMAT.EDIT_DATE) } ${ humanizeDate(dateFrom, DATE_FORMAT.TIME) } ${isDisabled ? 'disabled' : ''}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ humanizeDate(dateTo, DATE_FORMAT.EDIT_DATE) } ${ humanizeDate(dateTo, DATE_FORMAT.TIME) } ${isDisabled ? 'disabled' : ''}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${ basePrice }" ${isDisabled ? 'disabled' : ''}>
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">
                ${ isSaving ? 'Saving...' : 'Save' }
              </button>
              <button class="event__reset-btn" type="reset">
              ${ ('id' in point) ? deleting : 'Cancel'}</button>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>

            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${ showOffers }
                </div>
              </section>

              ${ destinationInfo }
            </section>
          </form>`;
};


export default class EditPointView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;

  #handleCloseEditClick = null;
  #handleSaveClick = null;
  #handleDeleteClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = BLANK_POINT, allOffers, allDestinations, onCloseEditClick, onSaveClick, onDeleteClick }) {
    super();
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this._setState(EditPointView.parsePointToState(point, allOffers, allDestinations));
    this.#handleSaveClick = onSaveClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCloseEditClick = onCloseEditClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point){
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element
      .addEventListener('submit', this.#formSaveHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeEditClickHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #pointTypeChangeHandler = (evt) => {
    if (!evt.target.matches('input[name=event-type]')) {
      return;
    }

    evt.preventDefault();
    const typeValue = evt.target.value;
    this.updateElement({
      type: typeValue,
      offers: [],
      availableOffers: this.#allOffers.find((offer) => (offer.type === typeValue)).offers
    });
  };

  #destinationChangeHandler = (evt) => {
    const destination = returnDestanition(evt.target.value, this.#allDestinations);
    if (destination === undefined) {
      this.reset(this._state);
    } else {
      this.updateElement({ destination: destination.id });
    }
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: parseInt(evt.target.value, 10),
    });
  };

  #formSaveHandler = (evt) => {
    evt.preventDefault();
    this.#handleSaveClick(EditPointView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditClick();
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedOffers = [...this._state.offers];
    const clickedOfferId = parseInt(evt.target.id.match(/\d+/), 10);

    if (evt.target.checked) {
      selectedOffers.push(clickedOfferId);
    } else {
      selectedOffers.splice(selectedOffers.indexOf(clickedOfferId), 1);
    }
    this.updateElement({ offers: selectedOffers });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        'time_24hr': true,
        onClose: this.#dateFromChangeHandler
      },
    );
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name = "event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        'time_24hr': true,
        onClose: this.#dateToChangeHandler,
      },
    );
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {
      ...state
    };

    delete point.isDeleting;
    delete point.isDisabled;
    delete point.isSaving;

    return point;
  }
}
