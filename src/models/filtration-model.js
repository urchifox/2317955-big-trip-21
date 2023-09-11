import Observable from '../framework/observable.js';
import {DEFAULT_FILTRATION, FILTRATION_OPTIONS} from '../const.js';

export default class FiltrationModel extends Observable {
  #currentFiltration = DEFAULT_FILTRATION;

  get currentFiltration() {
    return this.#currentFiltration;
  }

  setFiltration(updateType, filtrationName) {
    this.#currentFiltration = FILTRATION_OPTIONS.find((option) => option.name === filtrationName);
    this._notify(updateType, filtrationName);
  }
}
