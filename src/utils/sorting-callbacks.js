import {getDuration} from './dates';

function compareByDateFrom(pointA, pointB) {
  return pointA.dateFrom - pointB.dateFrom;
}

function compareByDateTo(pointA, pointB) {
  return pointA.dateTo - pointB.dateTo;
}

function compareByDuration(pointA, pointB) {
  return getDuration(pointB.dateFrom, pointB.dateTo) - getDuration(pointA.dateFrom, pointA.dateTo);
}

function compareByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  compareByDateFrom,
  compareByDateTo,
  compareByDuration,
  compareByPrice,
};
