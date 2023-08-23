import {render, replace} from '../framework/render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';
import NoPointsView from '../views/no-points-view.js';
import { isEscapeKeydown } from '../utils/random-elements.js';
import SortingView from '../views/sorting-view.js';

export default class BoardPresenter {
  #boardContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #listComponent = new ListView();
  #noPointsComponent = new NoPointsView();
  #sortingComponent = new SortingView();

  #listPoints = [];

  constructor({boardContainer: boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#listPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSorting();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderSorting() {
    render(this.#sortingComponent, this.#boardContainer);
  }

  #renderPointsList() {
    render(this.#listComponent, this.#boardContainer);

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if(isEscapeKeydown(evt.key)) {
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
      },
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });

    function replaceCardToForm() {
      replace(editComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, editComponent);
    }

    render(pointComponent, this.#listComponent.element);
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
}
