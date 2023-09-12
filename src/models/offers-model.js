export default class OffersModel {
  #offers = [];
  #offersApiService = null;

  constructor({offersApiService}) {
    this.#offersApiService = offersApiService;

  }

  get offers() {
    return this.#offers;
  }

  get allOffers() {
    return this.#offers.reduce((accumulator, offersByType) => [...accumulator, ...offersByType.offers], []);
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = [];
    }
  }

  getOffersByIds(offersIds) {
    if (offersIds.length === 0) {
      return [];
    }

    const result = offersIds.reduce((accumulator, offerId) => {
      const chosenOffer = this.allOffers.find((offer) => offer.id === offerId);

      if (chosenOffer) {
        return [...accumulator, chosenOffer];
      }

      return accumulator;
    }, []);

    return result;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
