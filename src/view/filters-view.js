import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter, isChecked){
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${ filter.name }" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter"
        value="${ filter.name }"
        ${ isChecked ? 'checked' : '' }
        ${ filter.count === 0 ? 'disabled' : '' }>
      <label class="trip-filters__filter-label" for="filter-${ filter.name }">${ filter.name }</label>
    </div>`
  );
}

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${ filtersTemplate }
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersView extends AbstractView {
  #filters;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
