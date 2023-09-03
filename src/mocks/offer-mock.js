import { POINT_TYPES, MAX_OFFERS_COUNT, MAX_OFFER_PRICE } from '../const.js';
import { getRandomInteger, makeNonRepeatingIdGenerator } from '../utils/random-elements.js';

const getNonRepeatingId = makeNonRepeatingIdGenerator(MAX_OFFERS_COUNT * POINT_TYPES.length);

class OfferMock {
  constructor(type) {
    this.id = getNonRepeatingId();
    this.title = `offer for ${type}`;
    this.price = getRandomInteger(MAX_OFFER_PRICE);
  }
}

const offersMocks = [];
for(const type of POINT_TYPES) {
  offersMocks.push({
    type: type,
    offers: Array.from(
      {length: getRandomInteger(MAX_OFFERS_COUNT)},
      () => new OfferMock(type)
    ),
  });
}

export {offersMocks};
