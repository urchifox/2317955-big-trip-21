import {SORTING_OPTIONS} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(currentOptionName) {
  const buttonsTemplate = SORTING_OPTIONS.map((option) => {
    const {name, sortCb} = option;

    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${name}">
        <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
          id="sort-${name}"
          value="sort-${name}"
          data-sort-name="${name}"
          ${sortCb ? '' : 'disabled'}
          ${option.name === currentOptionName ? 'checked' : ''}
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
  #currentOptionName = null;
  #handleOptionChange = null;

  constructor({currentOptionName, onOptionChange}) {
    super();
    this.#currentOptionName = currentOptionName;
    this.#handleOptionChange = onOptionChange;

    this.element.addEventListener('change', this.#optionChangeHandler);
  }

  get template() {
    return createTemplate(this.#currentOptionName);
  }

  #optionChangeHandler = (evt) => {
    this.#handleOptionChange(evt.target.dataset.sortName);
  };
}
