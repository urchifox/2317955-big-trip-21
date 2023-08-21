import { FILTERS } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createButtonTemplate(filterItems) {
  return FILTERS.map((filterName) => /*html*/`
    <div class="trip-filters__filter">
      <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        id="filter-${filterName.toLowerCase()}"
        value="${filterName.toLowerCase()}"
        ${filterItems[filterName] === 0 ? 'disabled' : ''}
        ${filterName === 'EVERYTHING' ? 'checked=""' : ''}>
      <label class="trip-filters__filter-label"
        for="filter-${filterName.toLowerCase()}">${filterName}
      </label>
    </div>
  `).join('');
}

function createTemplate(filterItems) {
  return /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${createButtonTemplate(filterItems)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltrationView extends AbstractView {
  #filters = null;

  constructor ({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createTemplate(this.#filters);
  }
}
