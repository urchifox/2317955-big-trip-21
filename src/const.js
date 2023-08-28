import { showAll, showFuture, showPast, showPresent } from './utils/filters';

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

export const SORTING_ABILITIES = [
  {'DAY': true},
  {'EVENT': false},
  {'TIME': true},
  {'PRICE': true},
  {'OFFERS': false},
];

export const DEFAULT_SORTING_INDEX = 0;

export const SORTING_OPTIONS = {
  DAY: {
    orderIndex: 0,
    isAble: true,
    name: 'DAY',
  },
  EVENT: {
    orderIndex: 1,
    isAble: false,
    name: 'EVENT',
  },
  TIME: {
    orderIndex: 2,
    isAble: true,
    name: 'TIME',
  },
  PRICE: {
    orderIndex: 3,
    isAble: true,
    name: 'PRICE',
  },
  OFFERS: {
    orderIndex: 4,
    isAble: false,
    name: 'OFFERS',
  },
};

export const DEFAULT_SORTING = SORTING_OPTIONS.DAY;
