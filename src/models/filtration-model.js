import Observable from '../framework/observable.js';
import {DEFAULT_FILTRATION_OPTION, FILTRATION_OPTIONS, UpdateType} from '../const.js';

export default class FiltrationModel extends Observable {
  #currentOption = DEFAULT_FILTRATION_OPTION;

  get currentOption() {
    return this.#currentOption;
  }

  setOption(filtrationName) {
    this.#currentOption = FILTRATION_OPTIONS.find((option) => option.name === filtrationName);
    this._notify(UpdateType.MAJOR, filtrationName);
  }
}
