import { destinationsMocks} from '../mocks/destination-mock.js';

export default class DestinationsModel {
  #destinations = destinationsMocks.slice();

  get destinations() {
    return this.#destinations;
  }
}
