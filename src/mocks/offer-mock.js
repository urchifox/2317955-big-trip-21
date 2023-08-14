import { POINT_TYPES, OFFERS_COUNT, MAX_OFFER_PRICE } from '../const.js';
import { getRandomArrayElement, getRandomInteger, makeNonRepeatingIdGenerator } from '../utils.js';

const getNonRepeatingId = makeNonRepeatingIdGenerator(OFFERS_COUNT);

class OfferMock {
  constructor() {
    this.id = getNonRepeatingId();
    this.type = getRandomArrayElement(POINT_TYPES);
    this.name = `offer for ${this.type}`;
    this.price = getRandomInteger(MAX_OFFER_PRICE);
  }
}
const offersMocks = Array.from(
  {length: OFFERS_COUNT},
  () => new OfferMock()
);

export {offersMocks};
