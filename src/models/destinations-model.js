export default class DestinationsModel {
  #destinations = [];
  #destinationsApiService = null;

  constructor({destinationsApiService}) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get allDestinationsNames() {
    return this.#destinations.map((destination) => destination.name);
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
