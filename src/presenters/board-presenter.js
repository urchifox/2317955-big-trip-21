import {remove, render} from '../framework/render.js';
import ListView from '../views/list-view.js';
import NoPointsView from '../views/no-points-view.js';
import SortingView from '../views/sorting-view.js';
import PointPresenter from './point-presenter.js';
import { DEFAULT_SORTING, SORTING_OPTIONS, UpdateType, UserAction } from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #listComponent = new ListView();
  #noPointsComponent = new NoPointsView();
  #sortingComponent = null;

  #pointsPresenters = new Map();
  #pointEditingId = null;
  #currentSortOption = DEFAULT_SORTING;

  constructor({boardContainer: boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return [...this.#pointsModel.points].sort(this.#currentSortOption.method);
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSorting();
    render(this.#listComponent, this.#boardContainer);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      currentSortType: this.#currentSortOption.name,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortingComponent, this.#boardContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = (id) => {
    if (this.#pointEditingId !== null && this.#pointEditingId !== id) {
      this.#pointsPresenters.get(this.#pointEditingId)?.resetView();
    }

    this.#pointEditingId = id;
  };

  #handleSortTypeChange = (sortName) => {
    const sortingOption = SORTING_OPTIONS.find((option) => option.name === sortName);

    if (this.#currentSortOption === sortingOption) {
      return;
    }
    this.#currentSortOption = sortingOption;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortOption = DEFAULT_SORTING;
    }
  }
}
