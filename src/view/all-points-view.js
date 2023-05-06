import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/date';

const Format = {
  DATE : 'MMM D',
  MONTH : 'MMM',
  DAY : 'D',
  TIME : 'HH:mm',
  EDIT_DATE : 'DD/MM/YY'
};

function createCities(values) {
  const cities = new Set();
  values.forEach( (city) => {
    cities.add(city.destination);
  });
  return Array.from(cities.keys()).map(
    (city, index, arr) => {
      if(index < arr.length - 1) {
        return `${city} &mdash; `;
      } return `${city}`;
    }
  ).join('');
}

function createDateInfo(values) {
  const dateFrom = humanizeDate(values[0].dateFrom, Format.DAY);
  const monthFrom = humanizeDate(values[0].dateFrom, Format.MONTH);
  const monthTo = humanizeDate(values[values.length - 1].dateTo, Format.MONTH);
  const dateTo = humanizeDate(values[values.length - 1].dateTo, Format.DAY);
  if(monthFrom === monthTo) {
    return `${monthFrom} ${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;
  }
  return `${monthFrom} ${dateFrom}&nbsp;&mdash;&nbsp;${monthTo} ${dateTo}`;
}

function calculateTotalPrice(point) {
  const initialValue = 0;
  const price = point.reduce(
    (accumulatorPrice, currentPrice) =>
      accumulatorPrice + currentPrice.basePrice, initialValue
  );
  return price;
}

function createAllPointsTemplate(allPoints) {
  const cities = createCities(allPoints);
  const totalPrice = calculateTotalPrice(allPoints);
  const date = createDateInfo(allPoints);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities}</h1>

        <p class="trip-info__dates">${date} Mar 18&nbsp;&mdash;&nbsp;20</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
}

export default class AllPointsView extends AbstractView {
  #point = null;

  constructor({point}) {
    super();
    this.#point = point;

  }

  get template() {
    return createAllPointsTemplate(this.#point);
  }
}
