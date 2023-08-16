import {render} from '../framework/render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = null;
  #listComponent = new ListView();
  #editComponent = new EditingView();
  #listPoints = [];

  constructor({listContainer, pointsModel, offersModel, destinationsModel}) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    render(this.#listComponent, this.#listContainer);
    render(this.#editComponent, this.#listComponent.element);
    for (let i = 0; i < this.#listPoints.length; i++) {
      render(new PointView({
        point: this.#listPoints[i],
        offersModel: this.offersModel.offers,
        destinationsModel: this.destinationsModel.destinations,
      }), this.#listComponent.element);
    }
  }
}
