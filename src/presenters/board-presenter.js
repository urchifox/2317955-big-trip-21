import {RenderPosition, remove, render} from '../framework/render.js';
import {DEFAULT_FILTRATION_OPTION, DEFAULT_SORTING_OPTION, Mode, SORTING_OPTIONS, TimeLimit, UpdateType, UserAction} from '../const.js';
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
  #headerContainer = null;

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

  #currentSortingOption = DEFAULT_SORTING_OPTION;
  #pointEditingId = null;
  #isLoading = false;
  #isCreating = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, headerContainer, pointsModel, offersModel, destinationsModel, filtrationModel}) {
    this.#boardContainer = boardContainer;
    this.#headerContainer = headerContainer;

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
    const filtrationOption = this.#filtrationModel.currentOption;
    const filteredPoints = points.filter(filtrationOption.filterCb);

    return filteredPoints.sort(this.#currentSortingOption.sortCb);
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewTaskButtonClick
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#disableNewPointButton();
      render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);

      return;
    }

    if (this.#pointsModel.isFailed
      || this.#offersModel.isFailed
      || this.#destinationsModel.isFailed
    ) {
      this.#disableNewPointButton();
      this.#renderNoPoints();

      return;
    }

    this.#disableNewPointButton(false);
    render(this.#listComponent, this.#boardContainer);
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#listComponent.element,
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy,
    });

    if (this.points.length === 0 && !this.#isCreating) {
      const filtrationOption = this.#filtrationModel.currentOption;
      this.#renderNoPoints(filtrationOption.noPointsMessage);

      return;
    }

    this.#renderSorting();
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #disableNewPointButton(isDisable = true) {
    this.#newPointButtonComponent.element.disabled = isDisable;
  }

  #renderNoPoints(message) {
    this.#noPointsComponent.setMessage(message);
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSorting() {
    this.#sortingComponent = new SortingView({
      currentOptionName: this.#currentSortingOption.name,
      onOptionChange: this.#handleSortingOptionChange
    });
    render(this.#sortingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#listComponent.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #clearBoard(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortingComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortingOption = DEFAULT_SORTING_OPTION;
    }
  }

  #createPoint() {
    this.#isCreating = true;
    this.#handleSortingOptionChange();
    this.#filtrationModel.setOption(DEFAULT_FILTRATION_OPTION.name);
    this.#newPointPresenter.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    const pointPresenter = this.#pointsPresenters.get(update.id);

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        pointPresenter.setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
          this.#pointEditingId = null;
        } catch(err) {
          pointPresenter.setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#pointEditingId = null;
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        pointPresenter.setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
          this.#pointEditingId = null;
        } catch(err) {
          pointPresenter.setAborting();
        }
        break;

      default:
        throw new Error('There are no such actionType');
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(point.id).init(point);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard(true);
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

  #handleModeChange = (id, mode) => {
    if (mode === Mode.DEFAULT) {
      this.#pointEditingId = null;
      return;
    }

    this.#newPointPresenter.destroy();

    if (this.#pointEditingId !== null) {
      this.#pointsPresenters.get(this.#pointEditingId).close();
    }

    this.#pointEditingId = id;
  };

  #handleSortingOptionChange = (sortingOptionName = DEFAULT_SORTING_OPTION.name) => {
    const sortingOption = SORTING_OPTIONS.find((option) => option.name === sortingOptionName);

    if (this.#currentSortingOption === sortingOption) {
      return;
    }

    this.#currentSortingOption = sortingOption;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleNewPointDestroy = () => {
    this.#disableNewPointButton(false);
    this.#isCreating = false;

    if (this.points.length === 0) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #handleNewTaskButtonClick = () => {
    this.#createPoint();
    this.#disableNewPointButton();
    this.#pointEditingId = null;
  };
}
