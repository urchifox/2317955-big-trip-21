import { POINT_TYPES, OFFER_NAMES, OFFERS_COUNT, MAX_OFFER_PRICE } from '../const.js';
import { getRandomArrayElement, getRandomInteger, makeNonRepeatingIdGenerator } from '../utils.js';

const getNonRepeatingId = makeNonRepeatingIdGenerator(OFFERS_COUNT);

class OfferMock {
  constructor() {
    this.id = getNonRepeatingId();
    this.type = getRandomArrayElement(POINT_TYPES);
    this.name = getRandomArrayElement(OFFER_NAMES);
    this.price = getRandomInteger(MAX_OFFER_PRICE);
  }
}
const offersMocks = Array.from(
  {length: OFFERS_COUNT},
  () => new OfferMock()
);

// console.log('offersMock');
// console.table(offersMocks);

export {offersMocks};
