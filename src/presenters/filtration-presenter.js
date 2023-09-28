import {render, replace, remove} from '../framework/render.js';
import FiltrationView from '../views/filtration-view.js';
import {DEFAULT_FILTRATION_OPTION, FILTRATION_OPTIONS, UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class FiltrationPresenter extends Observable {
  #container = null;
  #component = null;

  #pointsModel = null;

  #currentOption = DEFAULT_FILTRATION_OPTION;

  constructor({filtrationContainer, pointsModel}) {
    super();
    this.#container = filtrationContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get info() {
    const points = this.#pointsModel.points;

    return FILTRATION_OPTIONS.reduce((accumulator, option) => {
      accumulator[option.name] = Boolean(points.filter(option.filterCb).length);
      return accumulator;
    }, {});
  }

  get currentOption() {
    return this.#currentOption;
  }

  set currentOption(filtrationName) {
    this.#currentOption = FILTRATION_OPTIONS.find((option) => option.name === filtrationName);
    this._notify(UpdateType.MAJOR);
  }

  init() {
    const prevComponent = this.#component;

    this.#component = new FiltrationView({
      info: this.info,
      currentOptionName: this.currentOption.name,
      onOptionChange: this.#handleOptionChange
    });

    if (prevComponent === null) {
      render(this.#component, this.#container);
      return;
    }

    replace(this.#component, prevComponent);
    remove(prevComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleOptionChange = (optionName) => {
    this.currentOption = optionName;
  };
}
