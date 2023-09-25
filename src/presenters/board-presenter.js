import {RenderPosition, remove, render} from '../framework/render.js';
import {DEFAULT_FILTRATION_MODE, DEFAULT_SORTING_MODE, SORTING_MODES, TimeLimit, UpdateType, UserAction} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ListView from '../views/list-view.js';
import NoPointsView from '../views/no-points-view.js';
import SortingView from '../views/sorting-view.js';
import LoadingView from '../views/loading-view.js';
import NewPointButtonView from '../views/new-point-button-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #newPointButtonContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filtrationModel = null;

  #listComponent = new ListView();
  #noPointsComponent = new NoPointsView();
  #sortingComponent = null;
  #loadingComponent = new LoadingView();
  #newPointButtonComponent = null;

  #pointsPresenters = new Map();
  #newPointPresenter = null;

  #currentSortingMode = DEFAULT_SORTING_MODE;
  #pointEditingId = null;
  #isLoading = false;
  #isCreating = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, newPointButtonContainer, pointsModel, offersModel, destinationsModel, filtrationModel}) {
    this.#boardContainer = boardContainer;
    this.#newPointButtonContainer = newPointButtonContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtrationModel = filtrationModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtrationModel.addObserver(this.#handleModelEvent);

    this.#isLoading = true;
  }

  get points() {
    const points = this.#pointsModel.points;
    const filtrationMode = this.#filtrationModel.currentMode;
    const filteredPoints = points.filter(filtrationMode.filterCb);

    return filteredPoints.sort(this.#currentSortingMode.sortCb);
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewTaskButtonClick
    });
    this.#renderNewPointButton();
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#newPointButtonComponent.element.disabled = true;
      this.#renderLoading();

      return;
    }

    if(this.#pointsModel.isFailed || this.#offersModel.isFailed || this.#destinationsModel.isFailed) {
      this.#newPointButtonComponent.element.disabled = true;
      this.#renderNoPoints();

      return;
    }

    this.#newPointButtonComponent.element.disabled = false;
    render(this.#listComponent, this.#boardContainer);
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      offersByType: this.#offersModel.offers,
      allDestinations: this.#destinationsModel.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
    });

    if (this.points.length === 0 && !this.#isCreating) {
      const currentFiltration = this.#filtrationModel.currentMode;
      this.#renderNoPoints(currentFiltration.noPointsMessage);

      return;
    }

    this.#renderSorting();
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNewPointButton() {
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints(message) {
    this.#noPointsComponent.setMessage(message);
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      currentModeName: this.#currentSortingMode.name,
      onModeChange: this.#handleSortingModeChange
    });
    render(this.#sortingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortingMode = DEFAULT_SORTING_MODE;
    }
  }

  #createPoint() {
    this.#isCreating = true;
    this.#handleSortingModeChange();
    this.#filtrationModel.setMode(UpdateType.MAJOR, DEFAULT_FILTRATION_MODE.name);
    this.#newPointPresenter.init();
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
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
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

  #handleSortingModeChange = (sortingModeName = DEFAULT_SORTING_MODE.name) => {
    const sortingMode = SORTING_MODES.find((option) => option.name === sortingModeName);

    if (this.#currentSortingMode === sortingMode) {
      return;
    }

    this.#currentSortingMode = sortingMode;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewPointDestroy = () => {
    this.#newPointButtonComponent.element.disabled = false;
    this.#isCreating = false;

    if (this.points.length === 0) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #handleNewTaskButtonClick = () => {
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };
}
