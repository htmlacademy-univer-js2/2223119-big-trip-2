import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter, isChecked) {
  const {name, count} = filter;
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${ name }"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${ name }"
        ${ isChecked ? 'checked' : '' }
        ${ count === 0 ? 'disabled' : '' }>
      <label class="trip-filters__filter-label" for="filter-${ filter.name }">
        ${ filter.name }</label>
    </div>`
  );
}

function createFiltersTemplate(filters) {
  const filtersTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
        ${ filtersTemplate }
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
