import PointAdapter from '../adapters/point-adapter.js';
import { Method, ServerUrl } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class PointApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${ServerUrl.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: ServerUrl.POINTS,
      method: Method.POST,
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${ServerUrl.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
