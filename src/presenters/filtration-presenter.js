import {render, replace, remove} from '../framework/render.js';
import FiltrationView from '../views/filtration-view.js';
import {FILTRATION_OPTIONS, UpdateType} from '../const.js';

export default class FiltrationPresenter {
  #container = null;
  #filtrationModel = null;
  #pointsModel = null;

  #component = null;

  constructor({filtrationContainer, filtrationModel, pointsModel}) {
    this.#container = filtrationContainer;
    this.#filtrationModel = filtrationModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtrationModel.addObserver(this.#handleModelEvent);
  }

  get info() {
    const points = this.#pointsModel.points;

    return FILTRATION_OPTIONS.reduce((accumulator, option) => {
      accumulator[option.name] = Boolean(points.filter(option.filterCb).length);
      return accumulator;
    }, {});
  }

  init() {
    const prevComponent = this.#component;

    this.#component = new FiltrationView({
      info: this.info,
      currentOptionName: this.#filtrationModel.currentOption.name,
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
    this.#filtrationModel.setOption(UpdateType.MAJOR, optionName);
  };
}
