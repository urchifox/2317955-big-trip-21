import Observable from '../framework/observable.js';
import {DEFAULT_FILTRATION, FILTRATION_OPTIONS} from '../const.js';

export default class FiltrationModel extends Observable {
  // #filtration = FILTRATION_OPTIONS;
  #currentFilterOption = DEFAULT_FILTRATION;

  get currentFilter() {
    // return this.#filtration.find((filterOption) => filterOption.name === this.#currentFilterName);
    return this.#currentFilterOption;
  }

  setFilter(updateType, filterName) {
    this.#currentFilterOption = FILTRATION_OPTIONS.find((option) => option.name === filterName);
    this._notify(updateType, filterName);
  }
}
