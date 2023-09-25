import Observable from '../framework/observable.js';
import {DEFAULT_FILTRATION_MODE, FILTRATION_MODES} from '../const.js';

export default class FiltrationModel extends Observable {
  #currentMode = DEFAULT_FILTRATION_MODE;

  get currentMode() {
    return this.#currentMode;
  }

  setMode(updateType, filtrationName) {
    this.#currentMode = FILTRATION_MODES.find((option) => option.name === filtrationName);
    this._notify(updateType, filtrationName);
  }
}
