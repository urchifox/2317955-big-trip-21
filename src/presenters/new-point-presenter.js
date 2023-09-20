import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import { isEscapeKeydown } from '../utils/common.js';
import FormView from '../views/form-view';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #offersByType = null;
  #allDestinations = null;

  #pointEditComponent = null;

  constructor({pointListContainer, onDataChange, onDestroy, offersByType, allDestinations}) {
    this.#pointListContainer = pointListContainer;
    this.#offersByType = offersByType;
    this.#allDestinations = allDestinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormView({
      offersByType: this.#offersByType,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCloseClick,
      onCloseClick: this.#handleCloseClick,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    this.#pointEditComponent.setDatePicker();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }


    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    this.#handleDestroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
      this.#pointEditComponent.setDatePicker();
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCloseClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKeydown(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
