import {FILTRATION_MODES} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(filtrationInformation, currentFiltrationName) {
  const filtrationTemplate = FILTRATION_MODES.map((option) => {
    const filterName = option.name;
    return /*html*/`
      <div class="trip-filters__filter">
        <input class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          id="filter-${filterName}"
          value="${filterName}"
          ${filtrationInformation[filterName] ? '' : 'disabled'}
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
  #filtrationInformation = null;
  #currentModeName = null;
  #handleModeChange = null;

  constructor ({filtrationInformation, currentModeName, onModeChange}) {
    super();
    this.#filtrationInformation = filtrationInformation;
    this.#currentModeName = currentModeName;
    this.#handleModeChange = onModeChange;

    this.element.addEventListener('change', this.#modeChangeHandler);
  }

  get template() {
    return createTemplate(this.#filtrationInformation, this.#currentModeName);
  }

  #modeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleModeChange(evt.target.value);
  };
}
