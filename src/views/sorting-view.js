import { SORTING_OPTIONS, DEFAULT_SORTING } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  const sortingOptions = Object.values(SORTING_OPTIONS).sort((optionA, optionB) => optionA.orderIndex - optionB.orderIndex);
  const buttonsTemplate = sortingOptions.map((option) => {
    const {isDisable, name} = option;
    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${name}">
        <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
          id="sort-${name}"
          value="sort-${name}"
          data-sort-type="${name}"
          ${isDisable ? 'disabled' : ''}
          ${option === DEFAULT_SORTING ? 'checked' : ''}
          >
        <label class="trip-sort__btn" for="sort-${name}">
          ${name}
        </label>
      </div>
    `;
  }).join('');

  return /*html*/`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${buttonsTemplate}
    </form>
  `;
}

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
