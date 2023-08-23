import { pointsMocks} from '../mocks/point-mock.js';

export default class PointsModel {
  #points = pointsMocks.slice();
  // #points = [];

  get points() {
    return this.#points;
  }
}
