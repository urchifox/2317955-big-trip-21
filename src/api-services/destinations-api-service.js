import { ServerPaths } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class DestinationsApiService extends ApiService {
  get destinations() {
    return this._load({url: ServerPaths.DESTINATIONS})
      .then(ApiService.parseResponse);
  }
}
