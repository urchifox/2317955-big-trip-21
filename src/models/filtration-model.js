import Observable from '../framework/observable.js';
import {DEFAULT_FILTRATION, FILTRATION_OPTIONS} from '../const.js';

export default class FiltrationModel extends Observable {
  #currentFilterOption = DEFAULT_FILTRATION;

  get currentFilter() {
    return this.#currentFilterOption;
  }

  setFilter(updateType, filterName) {
    this.#currentFilterOption = FILTRATION_OPTIONS.find((option) => option.name === filterName);
    this._notify(updateType, filterName);
  }
}
