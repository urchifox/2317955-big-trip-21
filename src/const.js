import { showAll, showFuture, showPast, showPresent } from './utils/filters';
import { sortByDay, sortByPrice, sortByTime } from './utils/sorting';

export const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

export const POINTS_COUNT = 5;

export const MAX_POINT_PRICE = 5000;

export const OFFERS_COUNT = 20;

export const MAX_OFFER_PRICE = 1000;

export const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Rome', 'Warsaw', 'Moscow'];

export const CITIES_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

export const MAX_PICTURES_COUNT = 10;

export const FILTRATION_OPTIONS = [
  {'EVERYTHING': showAll},
  {'FUTURE'    : showFuture},
  {'PRESENT'   : showPresent},
  {'PAST'      : showPast},
];

export const DEFAULT_FILTRATION_INDEX = 0;

export const SORTING_OPTIONS = {
  DAY: {
    orderIndex: 0,
    isDisable: false,
    name: 'day',
    method: sortByDay,
  },
  EVENT: {
    orderIndex: 1,
    isDisable: true,
    name: 'event',
    method: null,
  },
  TIME: {
    orderIndex: 2,
    isDisable: false,
    name: 'time',
    method: sortByTime,
  },
  PRICE: {
    orderIndex: 3,
    isDisable: false,
    name: 'price',
    method: sortByPrice,
  },
  OFFERS: {
    orderIndex: 4,
    isDisable: true,
    name: 'offers',
    method: null,
  },
};

export const DEFAULT_SORTING = SORTING_OPTIONS.DAY;
