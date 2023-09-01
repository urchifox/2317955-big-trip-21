import { FILTRATION_OPTIONS } from '../const';
import { isFutureDate, isPastDate, isTodayDate } from './dates';

function showAll(points) {
  return points.filter((point) => point);
}

function showFuture(points) {
  return points.filter((point) => isFutureDate(point.periodStart));
}

function showPresent(points) {
  return points.filter((point) => (isPastDate(point.periodStart) || isTodayDate(point.periodStart)) && (isFutureDate(point.periodEnd) || isTodayDate(point.periodEnd)));
}

function showPast(points) {
  return points.filter((point) => isPastDate(point.periodEnd));
}

function calculateFilters(points) {
  return FILTRATION_OPTIONS.reduce((accumulator, option) => {
    accumulator[option.name] = option.method(points).length;
    return accumulator;
  }, {});
}

export {calculateFilters, showAll, showFuture, showPresent, showPast};
