export default class OffersModel {
  #offers = [];
  #offersApiService = null;
  #isFailed = false;

  constructor({offersApiService}) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  get allOffers() {
    return this.#offers.reduce((accumulator, offersByType) => [...accumulator, ...offersByType.offers], []);
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
      this.#isFailed = false;
    } catch(err) {
      this.#offers = [];
      this.#isFailed = true;
    }
  }

  getOffersByIds(offersIds) {
    if (offersIds.length === 0) {
      return [];
    }

    return offersIds.reduce((accumulator, offerId) => {
      const chosenOffer = this.allOffers.find((offer) => offer.id === offerId);

      if (chosenOffer) {
        return [...accumulator, chosenOffer];
      }

      return accumulator;
    }, []);
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
