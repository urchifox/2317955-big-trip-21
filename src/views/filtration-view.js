import {FILTRATION_OPTIONS} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(info, currentOptionName) {
  const filtrationTemplate = FILTRATION_OPTIONS.map((option) => {
    const optionName = option.name;

    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${optionName}"
          value="${optionName}"
          ${info[optionName] ? '' : 'disabled'}
          ${option.name === currentOptionName ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${optionName}">
          ${optionName}
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
  #info = null;
  #currentOptionName = null;
  #handleOptionChange = null;

  constructor ({info, currentOptionName, onOptionChange}) {
    super();
    this.#info = info;
    this.#currentOptionName = currentOptionName;
    this.#handleOptionChange = onOptionChange;

    this.element.addEventListener('change', this.#optionChangeHandler);
  }

  get template() {
    return createTemplate(this.#info, this.#currentOptionName);
  }

  #optionChangeHandler = (evt) => {
    this.#handleOptionChange(evt.target.value);
  };
}
