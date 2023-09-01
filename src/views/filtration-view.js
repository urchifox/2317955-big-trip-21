import {DEFAULT_FILTRATION, FILTRATION_OPTIONS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(filtersInformation) {
  const filtrationTemplate = FILTRATION_OPTIONS.map((option) => {
    const filterName = option.name;
    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${filterName.toLowerCase()}"
          value="${filterName.toLowerCase()}"
          ${filtersInformation[filterName] === 0 ? 'disabled' : ''}
          ${option === DEFAULT_FILTRATION ? 'checked=""' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">
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

  constructor ({filtersInformation}) {
    super();
    this.#filtersInformation = filtersInformation;
  }

  get template() {
    return createTemplate(this.#filtersInformation);
  }
}
