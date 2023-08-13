import { render } from '../render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';

export default class ListPresenter {
  listComponent = new ListView();
  editComponent = new EditingView();

  constructor({listContainer, pointsModel}) {
    this.listContainer = listContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];

    render(this.listComponent, this.listContainer);
    render(this.editComponent, this.listComponent.getElement());
    for (let i = 0; i < this.listPoints.length; i++) {
      render(new PointView({point: this.listPoints[i]}), this.listComponent.getElement());
    }
  }
}
