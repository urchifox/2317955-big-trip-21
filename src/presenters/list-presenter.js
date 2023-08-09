import { render } from '../render.js';
import EditingView from '../views/editing-view.js';
import ListView from '../views/list-view.js';
import PointView from '../views/point-view.js';

export default class ListPresenter {
  listComponent = new ListView();
  editComponent = new EditingView();

  constructor({listContainer}) {
    this.listContainer = listContainer;
  }

  init() {
    render(this.listComponent, this.listContainer);
    render(this.editComponent, this.listComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
