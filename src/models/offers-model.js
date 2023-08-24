import { offersMocks} from '../mocks/offer-mock.js';

export default class OffersModel {
  #offers = offersMocks.slice();

  get offers() {
    return this.#offers;
  }

  getOffersByIds(offersIds) {
    const chosenOffers = [];
    if (offersIds.length === 0) {
      return;
    }

    offersIds.forEach((offerId) => {
      const chosenOffer = this.#offers.find((offer) => offer.id === offerId);
      if (chosenOffer) {
        chosenOffers.push(chosenOffer);
      }
    });
    return chosenOffers;
  }

  getOffersByType(type) {
    return this.#offers.filter((offer) => offer.type === type);
  }
}
