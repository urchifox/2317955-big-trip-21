import {UpdateType} from '../const.js';
import PointAdapter from '../adapters/point-adapter.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointApiService = null;
  #isFailed = false;

  constructor({pointApiService}) {
    super();
    this.#pointApiService = pointApiService;
  }

  get points() {
    return this.#points;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(PointAdapter.adaptToClient);
      this.#isFailed = false;
    } catch(err) {
      this.#points = [];
      this.#isFailed = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = PointAdapter.adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = PointAdapter.adaptToClient(response);
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
      await this.#pointApiService.deletePoint(update);
      this.#points = this.#points.filter((_, pointIndex) => pointIndex !== index);
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }
}
