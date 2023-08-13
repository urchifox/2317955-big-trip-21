import { pointsMocks} from '../mocks/point-mock.js';

export default class PointsModel {
  points = pointsMocks.slice();

  getPoints() {
    return this.points;
  }
}

// const pointsModel = new PointsModel();
// console.log('PointsModel.getPoints() :>> ', pointsModel.getPoints());
