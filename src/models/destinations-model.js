import { destinationsMocks} from '../mocks/destination-mock.js';

export default class DestinationsModel {
  #destinations = destinationsMocks.slice();

  get destinations() {
    return this.#destinations;
  }

  get allDestinationsNames() {
    return this.#destinations.map((destination) => destination.name);
  }
}

const destinationsModel = new DestinationsModel();
console.log('destinationsModel :>> ', destinationsModel);
console.log('destinationsModel.allDestinationsNames :>> ', destinationsModel.allDestinationsNames);
// const allDestinations = destinationsModel.map((destination) => destination.name);

// console.log('allDestinations :>> ', allDestinations);
