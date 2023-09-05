import Observable from '../framework/observable.js';
import { pointsMocks} from '../mocks/point-mock.js';

export default class PointsModel extends Observable {
  #points = pointsMocks.slice();

  get points() {
    return this.#points;
  }
}
