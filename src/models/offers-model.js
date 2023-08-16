import { offersMocks} from '../mocks/offer-mock.js';

export default class OffersModel {
  #offers = offersMocks.slice();

  get offers() {
    return this.#offers;
  }
}
