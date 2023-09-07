import {FILTRATION_OPTIONS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(filtersInformation, currentFilterType) {
  const filtrationTemplate = FILTRATION_OPTIONS.map((option) => {
    const filterName = option.name;
    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${filterName}"
          value="${filterName}"
          ${filtersInformation[filterName] === 0 ? 'disabled' : ''}
          ${option.name === currentFilterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterName}">
          ${filterName}
        </label>
      </div>
    `;
  }).join('');

  return /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${filtrationTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltrationView extends AbstractView {
  #filtersInformation = null;
  #currentFilterName = null;
  #handleFilterTypeChange = null;

  constructor ({filtersInformation, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filtersInformation = filtersInformation;
    this.#currentFilterName = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTemplate(this.#filtersInformation, this.#currentFilterName);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
