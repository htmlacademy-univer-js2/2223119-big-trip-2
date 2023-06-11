import AbstractView from '../framework/view/abstract-view';
import { DATE_FORMAT, humanizeDate } from '../utils/date.js';
import { returnDestanition } from '../utils/point-inf';

function createCities(points, allDestinations) {
  const cities = new Set();
  points.forEach((point) => {
    cities.add(returnDestanition(point.destination, allDestinations));
  });

  const arrayCities = Array.from(cities);

  if (arrayCities.length <= 3) {
    return (
      arrayCities.map((city, index, arr) => {
        if (index < arr.length - 1) {
          return `${ city.name } &mdash; `;
        }
        return `${ city.name }`;
      }).join('')
    );
  }

  return `${ arrayCities[0].name } &mdash; ... &mdash; ${ arrayCities[arrayCities.length - 1].name }`;
}

function createDate(points) {
  const dateFrom = humanizeDate(points[0].dateFrom, DATE_FORMAT.DAY);
  const monthFrom = humanizeDate(points[0].dateFrom, DATE_FORMAT.MONTH);
  const monthTo = humanizeDate(points[points.length - 1].dateTo, DATE_FORMAT.MONTH);
  const dateTo = humanizeDate(points[points.length - 1].dateTo, DATE_FORMAT.DAY);

  if(monthFrom === monthTo) {
    return `${ monthFrom } ${ dateFrom } &mdash; ${ dateTo }`;
  }

  return `${ monthFrom } ${ dateFrom } &mdash; ${ monthTo } ${ dateTo }`;
}

function calculateTotalPrice(points, allOffers) {
  const price = points.reduce(
    (accumulatorPrice, currentPrice) =>
      accumulatorPrice + currentPrice.basePrice, 0
  );

  let offers = [];
  let offersPrice = 0;

  points.forEach((point) => {
    offers = allOffers.find((offerByType) => offerByType.type === point.type).offers;
    offersPrice += point.offers.reduce(
      (currentValue, offer) =>
        offers.find((off) => off.id === offer).price + currentValue, 0
    );
  });

  return price + offersPrice;
}

function createInformationTemplate(points, allDestinations, allOffers) {
  const cities = createCities(points, allDestinations);
  const date = createDate(points);
  const totalPrice = calculateTotalPrice(points, allOffers);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${ cities }</h1>
        <p class="trip-info__dates">${ date }</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${ totalPrice }</span>
      </p>
    </section>`
  );
}

export default class InformationView extends AbstractView {
  #points = null;
  #allDestinations = null;
  #allOffers = null;

  constructor({ points, allDestinations, allOffers }) {
    super();
    this.#points = points;
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
  }

  get template() {
    return createInformationTemplate(this.#points, this.#allDestinations, this.#allOffers);
  }
}
