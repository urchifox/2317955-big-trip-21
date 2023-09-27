import {remove, render, replace} from '../framework/render';
import {UserAction, UpdateType, Mode} from '../const.js';
import {isEscapeKeydown} from '../utils/common.js';
import FormView from '../views/form-view';
import PointView from '../views/point-view';

export default class PointPresenter {
  #container = null;
  #point = null;
  #pointComponent = null;
  #formComponent = null;

  #offersModel = null;
  #destinationsModel = null;

  #handlePointChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor ({container, offersModel, destinationsModel, onPointChange, onModeChange}) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handlePointChange = onPointChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offersModel.getOffersByIds(this.#point.offers),
      destination: this.#destinationsModel.getDestinationById(this.#point.destination),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#formComponent = new FormView({
      point: this.#point,
      offers: this.#offersModel.offers,
      destinations: this.#destinationsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onAbolishClick: this.#handleAbolishClick,
      onCloseClick: this.#handleCloseClick,
    });

    if (prevPointComponent === null || prevFormComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formComponent);
  }

  closeForm() {
    this.#formComponent.reset(this.#point);
    this.#replaceFormToCard();
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#formComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#formComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formComponent.shake(resetFormState);
  }

  // оба этих метода используются только один раз, имеет ли смысл их оставлять или вынести этот код в те места, где он используется?
  #replaceCardToForm() {
    replace(this.#formComponent, this.#pointComponent);
    this.#formComponent.setDatePicker();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
    this.#handleModeChange(this.#point.id, this.#mode);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#formComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#handleModeChange(this.#point.id, this.#mode);
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFavoriteClick = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleAbolishClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCloseClick = () => {
    this.closeForm();
  };

  #escKeyDownHandler = (evt) => {
    if(!isEscapeKeydown(evt.key)) {
      return;
    }
    evt.preventDefault();
    this.closeForm();
  };
}
