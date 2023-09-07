import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import { isEscapeKeydown } from '../utils/random-elements';
import EditingView from '../views/editing-view';
import { nanoid } from 'nanoid';

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

    this.#pointEditComponent = new EditingView({
      offersByType: this.#offersByType,
      allDestinations: this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point, id: nanoid() },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKeydown()) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
