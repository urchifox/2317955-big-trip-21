import { CITIES, CITIES_DESCRIPTIONS, MAX_PICTRES_COUNT } from '../const.js';
import { getRandomArrayElement, getRandomPictures, makeNextArrayElementGenerator, makeNonRepeatingIdGenerator } from '../utils.js';

const getNonRepeatingId = makeNonRepeatingIdGenerator(CITIES.length);
const getNextName = makeNextArrayElementGenerator(CITIES);

class DestinationMock {
  constructor() {
    this.id = getNonRepeatingId();
    this.name = getNextName();
    this.description = getRandomArrayElement(CITIES_DESCRIPTIONS);
    this.pictures = getRandomPictures(MAX_PICTRES_COUNT);
  }
}

const destionationsMocks = Array.from(
  {length: CITIES.length},
  () => new DestinationMock()
);

// console.log('destionationsMocks');
// console.table(destionationsMocks);

export {destionationsMocks};
