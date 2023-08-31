import { pointsMocks} from '../mocks/point-mock.js';

export default class PointsModel {
  #points = pointsMocks.slice();

  get points() {
    return this.#points;
  }
}
