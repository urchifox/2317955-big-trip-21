import { DEFAULT_SORTING_INDEX, SORTING_ABILITIES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingButtons() {
  return SORTING_ABILITIES.map((option, index) => {
    const [[sortingName, sortingAbility]] = Object.entries(option);
    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${sortingName.toLowerCase()}">
        <input class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
          id="sort-${sortingName.toLowerCase()}"
          value="sort-${sortingName.toLowerCase()}"
          ${sortingAbility ? '' : 'disabled'}
          ${index === DEFAULT_SORTING_INDEX ? 'checked=""' : ''}>
        <label class="trip-sort__btn" for="sort-${sortingName.toLowerCase()}">
          ${sortingName}
        </label>
      </div>
    `;
  }).join('');
}

function createTemplate() {
  return /*html*/`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createSortingButtons()}
    </form>
  `;
}

export default class SortingView extends AbstractView {

  get template() {
    return createTemplate();
  }
}
