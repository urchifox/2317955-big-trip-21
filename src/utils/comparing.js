import { getDuration } from './dates';

function compareByDayFrom(pointA, pointB) {
  return pointA.dateFrom - pointB.dateFrom;
}

function compareByDayTo(pointA, pointB) {
  return pointA.dateTo - pointB.dateTo;
}

function compareByDuration(pointA, pointB) {
  return getDuration(pointB.dateFrom, pointB.dateTo) - getDuration(pointA.dateFrom, pointA.dateTo);
}

function compareByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  compareByDayFrom,
  compareByDayTo,
  compareByDuration,
  compareByPrice,
};
