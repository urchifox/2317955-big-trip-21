import {render, replace} from '../framework/render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';
import NoPointsView from '../views/no-points-view.js';

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #listComponent = new ListView();
  #listPoints = [];

  constructor({listContainer, pointsModel, offersModel, destinationsModel}) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#renderList();
  }

  #getOffers(offersModel, chosenOffersIds) {
    const chosenOffers = [];
    if (!chosenOffersIds) {
      return;
    }
    chosenOffersIds.forEach((chosenId) => {
      const chosenOffer = offersModel.find((offer) => offer.id === chosenId);
      if (chosenOffer) {
        chosenOffers.push(chosenOffer);
      }
    });
    return chosenOffers;
  }

  #getDestination(destinationId) {
    return this.#destinationsModel.destinations.find((destination) => destination.id === destinationId);
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      offers: this.#getOffers(this.#offersModel.offers, point.chosenOffers),
      destination: this.#getDestination(point.destinationId),
      onEditClick:() => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const editComponent = new EditingView({
      point,
      offers: this.#getOffers(this.#offersModel.offers, point.chosenOffers),
      destination: this.#getDestination(point.destinationId),
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(editComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, editComponent);
    }

    render(pointComponent, this.#listComponent.element);
  }

  #renderList() {
    render(this.#listComponent, this.#listContainer);

    if (this.#listPoints.length === 0) {
      render(new NoPointsView(), this.#listComponent.element);
      return;
    }

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i]);
    }
  }
}
