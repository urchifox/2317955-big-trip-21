import { offersMocks} from '../mocks/offer-mock.js';

export default class OffersModel {
  #offers = offersMocks.slice();

  get offers() {
    return this.#offers;
  }

  get allOffers() {
    return this.#offers.reduce((accumulator, offersByType) => [...accumulator, ...offersByType.offers], []);
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
