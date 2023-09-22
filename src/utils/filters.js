import { FILTRATION_OPTIONS } from '../const';
import { isFutureDate, isPastDate, isTodayDate } from './dates';

function showAll(point) {
  return point;
}

function showFuture(point) {
  return isFutureDate(point.dateFrom);
}

function showPresent(point) {
  return (isPastDate(point.dateFrom) || isTodayDate(point.dateFrom)) && (isFutureDate(point.dateTo) || isTodayDate(point.dateTo));
}

function showPast(point) {
  return isPastDate(point.dateTo);
}

function calculateFilters(points) {
  return FILTRATION_OPTIONS.reduce((accumulator, option) => {
    accumulator[option.name] = points.filter(option.filterCb).length;
    return accumulator;
  }, {});
}

export {calculateFilters, showAll, showFuture, showPresent, showPast};
