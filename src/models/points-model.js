import { pointsMocks} from '../mocks/point-mock.js';

export default class PointsModel {
  points = pointsMocks.slice();

  getPoints() {
    return this.points;
  }
}
