import { FILTRATION_OPTIONS } from '../const';
import { isFutureDate, isPastDate, isTodayDate } from './dates';

function showAll(points) {
  return points.filter((point) => point);
}

function showFuture(points) {
  return points.filter((point) => isFutureDate(point.dateFrom));
}

function showPresent(points) {
  return points.filter((point) => (isPastDate(point.dateFrom) || isTodayDate(point.dateFrom)) && (isFutureDate(point.dateTo) || isTodayDate(point.dateTo)));
}

function showPast(points) {
  return points.filter((point) => isPastDate(point.dateTo));
}

function calculateFilters(points) {
  return FILTRATION_OPTIONS.reduce((accumulator, option) => {
    accumulator[option.name] = option.method(points).length;
    return accumulator;
  }, {});
}

export {calculateFilters, showAll, showFuture, showPresent, showPast};
