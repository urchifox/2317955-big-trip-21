import {FILTRATION_OPTIONS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(filtrtationsInformation, currentFiltrationName) {
  const filtrationTemplate = FILTRATION_OPTIONS.map((option) => {
    const filterName = option.name;
    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${filterName}"
          value="${filterName}"
          ${filtrtationsInformation[filterName] ? '' : 'disabled'}
          ${option.name === currentFiltrationName ? 'checked' : ''}>
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
  #filtrtationsInformation = null;
  #currentFiltrationName = null;
  #handleFilterTypeChange = null;

  constructor ({filtrtationsInformation, currentFiltrationName, onFilterTypeChange}) {
    super();
    this.#filtrtationsInformation = filtrtationsInformation;
    this.#currentFiltrationName = currentFiltrationName;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTemplate(this.#filtrtationsInformation, this.#currentFiltrationName);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
