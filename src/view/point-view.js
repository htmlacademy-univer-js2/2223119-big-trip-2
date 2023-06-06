import AbstractView from '../framework/view/abstract-view';
import { DATE_FORMAT, humanizeDate, durationPoint } from '../utils/date.js';
import { returnDestanition } from '../utils/point-inf';

const createOffersList = (pointType, pointOffers, allOffers) => {
  const allOffersForType = allOffers.find((point) => point.type === pointType).offers;
  const selectedOffers = pointOffers.map((offer) => allOffersForType.find((item) => item.id === offer));

  return (
    `${ selectedOffers.map((offer) =>
      `<li class="event__offer">
        <span class="event__offer-title">${ offer.title }</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${ offer.price }</span>
      </li>`).join('\n')}`
  );
};

function createPointTemplate(point, allOffers, allDestinations) {
  const{ basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = point;
  const humanizeDateFrom = humanizeDate(dateFrom, DATE_FORMAT.DATE);
  const humanizeTimeFrom = humanizeDate(dateFrom, DATE_FORMAT.TIME);
  const humanizeTimeTo = humanizeDate(dateTo, DATE_FORMAT.TIME);
  const durationTime = durationPoint(dateFrom, dateTo);
  const showOffers = createOffersList(type, offers, allOffers);
  const city = returnDestanition(destination, allDestinations) ? returnDestanition(destination, allDestinations).name : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${ dateFrom }">${ humanizeDateFrom }</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${ type }.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${ type } ${ city }</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${ dateFrom }">${ humanizeTimeFrom }</time>
            &mdash;
            <time class="event__end-time" datetime="${ dateTo }">${ humanizeTimeTo }</time>
          </p>
          <p class="event__duration">${ durationTime }</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${ basePrice }</span>
        </p>
        ${ offers ? `<h4 class="visually-hidden">Offers:</h4>
                      <ul class="event__selected-offers">
                        ${ showOffers }
                      </ul>` : ''}
        <button class="event__favorite-btn ${ isFavorite ? 'event__favorite-btn--active' : '' }" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #handleOpenEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, allOffers, allDestinations, onOpenEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleOpenEditClick = onOpenEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openEditClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#allOffers, this.#allDestinations);
  }

  #openEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleOpenEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
