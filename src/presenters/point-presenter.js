import { render, replace } from '../framework/render';
import { isEscapeKeydown } from '../utils/random-elements';
import EditingView from '../views/editing-view';
import PointView from '../views/point-view';

export default class PointPresenter {
  #pointsListContainer = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #offersModel = null;
  #destinationsModel = null;

  constructor ({pointListContainer, offersModel, destinationsModel}) {
    this.#pointsListContainer = pointListContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offersModel.getOffersByIds(this.#point.chosenOffers),
      destination: this.#destinationsModel.getDestinationById(this.#point.destinationId),
      onEditClick: this.#handleEditClick,
    });

    this.#pointEditComponent = new EditingView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getDestinationById(this.#point.destinationId),
      onFormSubmit: this.#handleFormSubmit,
      allOffersThisType: this.#offersModel.getOffersByType(this.#point.type),
      allDestinationsNames: this.#destinationsModel.allDestinationsNames,
    });

    render(this.#pointComponent, this.#pointsListContainer);
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #escKeyDownHandler = (evt) => {
    if(isEscapeKeydown(evt.key)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
