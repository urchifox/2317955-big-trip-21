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

  // TODO переписать вывод данных в формат имя фильтра : булин в соответствии с которым дисэйблить
  get filtrationInformation() {
    const points = this.#pointsModel.points;

    return FILTRATION_OPTIONS.reduce((accumulator, option) => {
      accumulator[option.name] = Boolean(option.filter(points).length);
      return accumulator;
    }, {});
  }

  init() {
    const prevFilterComponent = this.#filtrationComponent;

    this.#filtrationComponent = new FiltrationView({
      filtrationInformation: this.filtrationInformation,
      currentFiltrationName: this.#filtrationModel.currentFiltration.name,
      onFilterTypeChange: this.#handleFilterTypeChange
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

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtrationModel.filter === filterType) {
      return;
    }

    this.#filtrationModel.setFiltration(UpdateType.MAJOR, filterType);
  };
}
