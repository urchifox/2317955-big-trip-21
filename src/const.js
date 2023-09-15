import { showAll, showFuture, showPast, showPresent } from './utils/filters';
import { sortByDay, sortByPrice, sortByTime } from './utils/sorting';

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

// TODO filterFn либо переписать на колбэк и сделать filterCb
export const FILTRATION_OPTIONS = [
  {
    name: 'everything',
    filter: showAll,
  },
  {
    name: 'future',
    filter: showFuture,
  },
  {
    name: 'present',
    filter: showPresent,
  },
  {
    name: 'past',
    filter: showPast,
  },
];

export const DEFAULT_FILTRATION = FILTRATION_OPTIONS[0];

// TODO sortCb
export const SORTING_OPTIONS = [
  {
    name: 'day',
    sortingMethod: sortByDay,
    isDisable: false,
  },
  {
    name: 'event',
    sortingMethod: null,
    isDisable: true,
  },
  {
    name: 'time',
    sortingMethod: sortByTime,
    isDisable: false,
  },
  {
    name: 'price',
    sortingMethod: sortByPrice,
    isDisable: false,
  },
  {
    name: 'offers',
    sortingMethod: null,
    isDisable: true,
  },
];

export const DEFAULT_SORTING = SORTING_OPTIONS[0];

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

// TODO adress? domen?
export const ServerUrl = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
