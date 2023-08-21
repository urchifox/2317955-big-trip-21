import { DEFAULT_FILTRATION_INDEX, FILTRATION_OPTIONS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilters(filtersInformation) {
  return FILTRATION_OPTIONS.map((option, index) => {
    const [[filterName]] = Object.entries(option);
    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${filterName.toLowerCase()}"
          value="${filterName.toLowerCase()}"
          ${filtersInformation[filterName] === 0 ? 'disabled' : ''}
          ${index === DEFAULT_FILTRATION_INDEX ? 'checked=""' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">
          ${filterName}
        </label>
      </div>
    `;
  }).join('');
}

function createTemplate(filterItems) {
  return /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${createFilters(filterItems)}
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
