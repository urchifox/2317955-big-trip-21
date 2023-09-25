import {SORTING_MODES} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(currentSortType) {
  const buttonsTemplate = SORTING_MODES.map((option) => {
    const {name, isDisable} = option;
    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${name}">
        <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
          id="sort-${name}"
          value="sort-${name}"
          data-sort-name="${name}"
          ${isDisable ? 'disabled' : ''}
          ${option.name === currentSortType ? 'checked' : ''}
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
  #handleModeChange = null;
  #currentModeName = null;

  constructor({currentModeName, onModeChange}) {
    super();
    this.#currentModeName = currentModeName;
    this.#handleModeChange = onModeChange;

    this.element.addEventListener('click', this.#modeChangeHandler);
  }

  get template() {
    return createTemplate(this.#currentModeName);
  }

  #modeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleModeChange(evt.target.dataset.sortName);
  };
}
