import {UpdateType} from '../const.js';
import Adapter from '../adapter.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #tripApiService = null;
  #isFailed = false;

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
  }

  get points() {
    return this.#points;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      const points = await this.#tripApiService.getPoints();
      this.#points = points.map(Adapter.adaptToClient);
    } catch(err) {
      this.#points = [];
      this.#isFailed = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const oldPoint = this.#points.find((point) => point.id === update.id);

    if (!oldPoint) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#tripApiService.updatePoint(update);
      const updatedPoint = Adapter.adaptToClient(response);
      this.#points = this.#points.map((point) => point === oldPoint ? {...updatedPoint} : {...point});
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#tripApiService.addPoint(update);
      const newPoint = Adapter.adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#tripApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }
}
