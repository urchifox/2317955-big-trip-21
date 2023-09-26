export default class DestinationsModel {
  #destinations = [];
  #destinationsApiService = null;
  #isFailed = false;

  constructor({tripApiService}) {
    this.#destinationsApiService = tripApiService;
  }

  get destinations() {
    return this.#destinations;
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
