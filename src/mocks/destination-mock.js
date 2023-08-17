import { CITIES, CITIES_DESCRIPTIONS, MAX_PICTURES_COUNT } from '../const.js';
import { getRandomArrayElement, getRandomPictures, makeNextArrayElementGenerator, makeNonRepeatingIdGenerator } from '../utils/random-elements.js';

const getNonRepeatingId = makeNonRepeatingIdGenerator(CITIES.length);
const getNextName = makeNextArrayElementGenerator(CITIES);

class DestinationMock {
  constructor() {
    this.id = getNonRepeatingId();
    this.name = getNextName();
    this.description = getRandomArrayElement(CITIES_DESCRIPTIONS);
    this.pictures = getRandomPictures(MAX_PICTURES_COUNT);
  }
}

const destinationsMocks = Array.from(
  {length: CITIES.length},
  () => new DestinationMock()
);


export {destinationsMocks};
