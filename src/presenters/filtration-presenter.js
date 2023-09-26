import {render, replace, remove} from '../framework/render.js';
import FiltrationView from '../views/filtration-view.js';
import {FILTRATION_OPTIONS, UpdateType} from '../const.js';

export default class FiltrationPresenter {
  #filtrationContainer = null;
  #filtrationModel = null;
  #pointsModel = null;

  #filtrationComponent = null;

  constructor({filtrationContainer, filtrationModel, pointsModel}) {
    this.#filtrationContainer = filtrationContainer;
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
    const prevFilterComponent = this.#filtrationComponent;

    this.#filtrationComponent = new FiltrationView({
      info: this.info,
      currentOptionName: this.#filtrationModel.currentOption.name,
      onOptionChange: this.#handleFiltrationOptionChange
    });

    if (prevFilterComponent === null) {
      render(this.#filtrationComponent, this.#filtrationContainer);
      return;
    }

    replace(this.#filtrationComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFiltrationOptionChange = (optionName) => {
    this.#filtrationModel.setOption(UpdateType.MAJOR, optionName);
  };
}
