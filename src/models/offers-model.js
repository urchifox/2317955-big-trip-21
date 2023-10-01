export default class OffersModel {
  #offers = [];
  #tripApiService = null;
  #isFailed = false;

  constructor({tripApiService}) {
    this.#tripApiService = tripApiService;
  }

  get offers() {
    return this.#offers;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#offers = await this.#tripApiService.getOffers();
    } catch(err) {
      this.#offers = [];
      this.#isFailed = true;
    }
  }

  // getTypes() {
  //   return
  // }

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
