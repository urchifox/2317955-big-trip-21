import {render, replace} from '../framework/render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';
import NoPointsView from '../views/no-points-view.js';

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;
  #listComponent = new ListView();
  #listPoints = [];

  constructor({listContainer, pointsModel, offersModel, destinationsModel}) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#renderList();
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
      offersModel: this.offersModel.offers,
      destinationsModel: this.destinationsModel.destinations,
      onEditClick:() => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const editComponent = new EditingView({
      point,
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
