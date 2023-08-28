import { /*EFAULT_SORTING_INDEX, SORTING_ABILITIES,*/ SORTING_OPTIONS, DEFAULT_SORTING } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  // const buttonsTemplate = SORTING_ABILITIES.map((option, index) => {
  //   const [[sortingName, sortingAbility]] = Object.entries(option);
  //   return /*html*/`
  //     <div class="trip-sort__item  trip-sort__item--${sortingName.toLowerCase()}">
  //       <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
  //         id="sort-${sortingName.toLowerCase()}"
  //         value="sort-${sortingName.toLowerCase()}"
  //         ${sortingAbility ? '' : 'disabled'}
  //         ${index === DEFAULT_SORTING_INDEX ? 'checked=""' : ''}>
  //       <label class="trip-sort__btn" for="sort-${sortingName.toLowerCase()}">
  //         ${sortingName}
  //       </label>
  //     </div>
  //   `;
  // }).join('');

  const sortingOptions = Object.values(SORTING_OPTIONS).sort((optionA, optionB) => optionA.orderIndex - optionB.orderIndex);
  const buttonsTemplate = sortingOptions.map((option) => {
    const {isAble, name} = option;
    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
        <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
          id="sort-${name.toLowerCase()}"
          value="sort-${name.toLowerCase()}"
          data-sort-type="${name.toLowerCase()}"
          ${isAble ? '' : 'disabled'}
          ${option === DEFAULT_SORTING ? 'checked=""' : ''}>
        <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">
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

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
