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

    const allOffers = this.#offers.reduce((accumulator, offersByType) => [...accumulator, ...offersByType.offers], []);

    return offersIds.reduce((accumulator, offerId) => {
      const chosenOffer = allOffers.find((offer) => offer.id === offerId);

      return (chosenOffer ? [...accumulator, chosenOffer] : accumulator);
    }, []);
  }
}
