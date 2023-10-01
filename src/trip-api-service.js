import {Method, ServerPaths} from './const.js';
import ApiService from './framework/api-service.js';
import Adapter from './point-adapter.js';

export default class TripApiService extends ApiService {
  async getPoints() {
    return await this._load({url: ServerPaths.POINTS})
      .then(ApiService.parseResponse);
  }

  async getDestinations() {
    return await this._load({url: ServerPaths.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  async getOffers() {
    return await this._load({url: ServerPaths.OFFERS})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${ServerPaths.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(Adapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: ServerPaths.POINTS,
      method: Method.POST,
      body: JSON.stringify(Adapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    return await this._load({
      url: `${ServerPaths.POINTS}/${point.id}`,
      method: Method.DELETE,
    });
  }
}
