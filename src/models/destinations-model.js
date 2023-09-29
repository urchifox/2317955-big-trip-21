export default class DestinationsModel {
  #destinations = [];
  #tripApiService = null;
  #isFailed = false;

  constructor({tripApiService}) {
    this.#tripApiService = tripApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#destinations = await this.#tripApiService.getDestinations();
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
