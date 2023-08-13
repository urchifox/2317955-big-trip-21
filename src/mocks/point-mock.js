import { CITIES, MAX_POINT_PRICE, POINTS_COUNT, POINT_TYPES } from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { offersMocks } from './offer-mock.js';

function getChosenOffers(type) {
  const allOffers = offersMocks.filter((offer) => offer.type === type);
  return Array.from(
    {length: getRandomInteger(allOffers.length)},
    () => getRandomArrayElement(allOffers)
  );
}

class PointMock {
  constructor() {
    this.type = getRandomArrayElement(POINT_TYPES);
    this.destinationId = getRandomInteger(CITIES.length);
    this.timeStart = `${getRandomInteger(31)}/08/2023 ${getRandomInteger(24)}:00`;
    this.timeEnd = `${getRandomInteger(31)}/08/2023 ${getRandomInteger(24)}:00`;
    this.price = getRandomInteger(MAX_POINT_PRICE);
    this.isFavorite = Boolean(getRandomInteger(2));
    this.chosenOffers = getChosenOffers(this.type);
  }
}

const pointsMocks = Array.from(
  {length: POINTS_COUNT},
  () => new PointMock()
);

// console.log('pointsMocks');
// console.table(pointsMocks);

export {pointsMocks};
