import {render} from '../framework/render.js';
import ListView from '../views/list-view.js';
import NoPointsView from '../views/no-points-view.js';
import SortingView from '../views/sorting-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { DEFAULT_SORTING, SORTING_OPTIONS } from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #listComponent = new ListView();
  #noPointsComponent = new NoPointsView();
  #sortingComponent = null;

  #points = [];
  #pointsPresenters = new Map();
  #pointEditingId = null;
  #currentSortName = DEFAULT_SORTING.name;

  constructor({boardContainer: boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#sortPoints(this.#currentSortName);
    this.#renderSorting();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortingComponent, this.#boardContainer);
  }

  #renderPointsList() {
    render(this.#listComponent, this.#boardContainer);

    for (const point of this.#points) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = (id) => {
    if (this.#pointEditingId !== null && this.#pointEditingId !== id) {
      this.#pointsPresenters.get(this.#pointEditingId).resetView();
    }
    this.#pointEditingId = id;
  };

  #handleSortTypeChange = (sortName) => {
    if (this.#currentSortName === sortName) {
      return;
    }
    this.#sortPoints(sortName);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #sortPoints(sortName) {
    this.#currentSortName = sortName;

    const sortingOption = SORTING_OPTIONS.find((option) => option.name === this.#currentSortName);
    this.#points.sort(sortingOption.method);
  }

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }
}
