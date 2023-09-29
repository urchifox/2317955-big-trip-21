import {RenderPosition, remove, render} from '../framework/render';
import {UpdateType, UserAction} from '../const';
import {isEscapeKeydown} from '../utils/common.js';
import FormView from '../views/form-view';

export default class NewPointPresenter {
  #container = null;
  #component = null;

  #offers = null;
  #destinations = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({container, offers, destinations, onDataChange, onDestroy}) {
    this.#container = container;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#component !== null) {
      return;
    }

    this.#component = new FormView({
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDiscardClick: this.#handleDiscardClick,
    });

    render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
    this.#component.setDatePicker();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#component === null) {
      return;
    }

    remove(this.#component);
    this.#component = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDestroy();
  }

  setSaving() {
    this.#component.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#component.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#component.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDiscardClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKeydown(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
