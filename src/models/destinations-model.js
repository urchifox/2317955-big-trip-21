export default class DestinationsModel {
  #destinations = [];
  #destinationsApiService = null;
  #isFailed = false;

  constructor({destinationsApiService}) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get allDestinationsNames() {
    return this.#destinations.map((destination) => destination.name);
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
      this.#isFailed = false;
    } catch(err) {
      this.#destinations = [];
      this.#isFailed = true;
    }
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
