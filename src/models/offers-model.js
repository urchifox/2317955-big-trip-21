import { offersMocks} from '../mocks/offer-mock.js';

export default class OffersModel {
  #offers = offersMocks.slice();

  get offers() {
    return this.#offers;
  }

  getOffersByIds(offersIds) {
    if (offersIds.length === 0) {
      return [];
    }

    return offersIds.reduce((accumulator, offerId) => {
      const chosenOffer = this.#offers.find((offer) => offer.id === offerId);

      if (chosenOffer) {
        return [...accumulator, chosenOffer];
      }

      return accumulator;
    }, []);
  }

  getOffersByType(type) {
    return this.#offers.filter((offer) => offer.type === type);
  }
}
