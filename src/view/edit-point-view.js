import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DATE_FORMAT, humanizeDate } from '../utils/date.js';
import flatpickr from 'flatpickr';
import { returnDestanition } from '../utils/point-inf.js';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  destination: '',
  city: '',
  offers: [],
  type: []
};

function createOfferTypes(allOffers) {
  const allTypes = allOffers.map(({type}) => type);
  return allTypes.map((offerType, index) =>
    `
      <div class="event__type-item">
        <input id="event-type-${offerType}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${ offerType.type }">
        <label class="event__type-label  event__type-label--${ offerType }" for="event-type-${offerType}-${index}">${ offerType }</label>
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

function returnThisOffer(offer, allOffers) {
  const offerCurrentArray = allOffers.map(({offers}) => offers.filter((item) => item.title.toLowerCase() === offer.toLowerCase()));
  const offerCurrent = offerCurrentArray.filter((item) => item.length);
  return offerCurrent[0][0];
}

function createOffers(pointType, offers, allOffers) {
  const allOffersForType = allOffers.find((point) => point.type === pointType).offers;

  function isOfferSelected(currentOffers, offer) {
    if(currentOffers) {
      return currentOffers.find( (currentOffer) => currentOffer === offer.id) ;
    } return '';
  }

  return (
    `${allOffersForType.map((offer, index) =>
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox" name="event-offer-luggage" ${ isOfferSelected(offers, offer) ? 'checked' : ''}  data-type="${ pointType }" data-offer-id="${offer.id}">
        <label class="event__offer-label" for="event-offer-luggage-${index}">
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
  const{ basePrice, dateFrom, dateTo, destination, offers, type} = point;
  const offerTypes = createOfferTypes(allOffers);
  const cityList = createListCities(allDestinations);
  const showOffers = createOffers(type, offers, allOffers);
  const destinationInfo = createDestinationTemplate(destination, allDestinations);
  const city = returnDestanition(destination, allDestinations) ? returnDestanition(destination, allDestinations).name : '';

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
                    ${ offerTypes }
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${ type }
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${ city }" list="destination-${ point.id }">
                <datalist id="destination-${ point.id }">
                  ${ cityList }
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ humanizeDate(dateFrom, DATE_FORMAT.EDIT_DATE) } ${ humanizeDate(dateFrom, DATE_FORMAT.TIME) }">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ humanizeDate(dateTo, DATE_FORMAT.EDIT_DATE) } ${ humanizeDate(dateTo, DATE_FORMAT.TIME) }">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-${ point.id }">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-${ point.id }" type="text" name="event-price" value="${ basePrice }">
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

  #datepicker = null;

  constructor({point = BLANK_POINT, allOffers, allDestinations, onCloseEditClick, onSaveClick, onDeleteClick}) {
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
    const offer = returnThisOffer(evt.target.dataset.offer, this.#allOffers);
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
