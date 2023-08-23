import { render, replace } from '../framework/render';
import { isEscapeKeydown } from '../utils/random-elements';
import EditingView from '../views/editing-view';
import PointView from '../views/point-view';

export default class PointPresenter {
  #pointsListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
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
      offers: this.#getOffers(this.#offersModel, point.chosenOffers),
      destination: this.#getDestination(point.destinationId),
      onEditClick: this.#handleEditClick,
    });
    this.#pointEditComponent = new EditingView({
      point: this.#point,
      offers: this.#getOffers(this.#offersModel.offers, point.chosenOffers),
      destination: this.#getDestination(point.destinationId),
      onFormSubmit: this.#handleFormSubmit,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });

    render(this.#pointComponent, this.#pointsListContainer);
  }

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #getOffers(offersModel, chosenOffersIds) {
    const chosenOffers = [];
    if (!chosenOffersIds) {
      return;
    }

    chosenOffersIds.forEach((chosenId) => {
      const chosenOffer = offersModel.offers.find((offer) => offer.id === chosenId);
      if (chosenOffer) {
        chosenOffers.push(chosenOffer);
      }
    });
    return chosenOffers;
  }

  #getDestination(destinationId) {

    return this.#destinationsModel.destinations.find((destination) => destination.id === destinationId);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if(isEscapeKeydown(evt.key)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };
}
