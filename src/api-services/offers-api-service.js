import { ServerUrl } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: ServerUrl.OFFERS})
      .then(ApiService.parseResponse);
  }
}
