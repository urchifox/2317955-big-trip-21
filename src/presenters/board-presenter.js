import {RenderPosition, remove, render} from '../framework/render.js';
import ListView from '../views/list-view.js';
import NoPointsView from '../views/no-points-view.js';
import SortingView from '../views/sorting-view.js';
import PointPresenter from './point-presenter.js';
import { DEFAULT_FILTRATION, DEFAULT_SORTING, SORTING_OPTIONS, TimeLimit, UpdateType, UserAction } from '../const.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../views/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #boardContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filtrationModel = null;

  #listComponent = new ListView();
  #noPointsComponent = new NoPointsView();
  #sortingComponent = null;
  #loadingComponent = new LoadingView();

  #pointsPresenters = new Map();
  #newPointPresenter = null;
  #pointEditingId = null;
  #currentSortOption = DEFAULT_SORTING;
  #isLoading = false;
  #onNewPointDestroy = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, pointsModel, offersModel, destinationsModel, filtrationModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtrationModel = filtrationModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtrationModel.addObserver(this.#handleModelEvent);
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#isLoading = true;
  }

  get points() {
    const points = [...this.#pointsModel.points];
    const filtrationType = this.#filtrationModel.currentFiltration;
    const filteredPoints = filtrationType.filter(points);

    return filteredPoints.sort(this.#currentSortOption.sortingMethod);
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#handleSortTypeChange();
    this.#filtrationModel. setFiltration(UpdateType.MAJOR, DEFAULT_FILTRATION.name);
    this.#newPointPresenter.init();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      offersByType: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });

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

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      default:
        throw new Error('There are no such actionType');
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      default:
        throw new Error('There are no such updateType');
    }
  };

  #handleModeChange = (id) => {
    this.#newPointPresenter.destroy();
    if (this.#pointEditingId !== null && this.#pointEditingId !== id) {
      this.#pointsPresenters.get(this.#pointEditingId)?.resetView();
    }

    this.#pointEditingId = id;
  };

  #handleSortTypeChange = (sortName = DEFAULT_SORTING.name) => {
    const sortingOption = SORTING_OPTIONS.find((option) => option.name === sortName);

    if (this.#currentSortOption === sortingOption) {
      return;
    }
    this.#currentSortOption = sortingOption;
    this.#clearBoard({resetRenderedTaskCount: true});
    this.#renderBoard();
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortOption = DEFAULT_SORTING;
    }
  }
}
