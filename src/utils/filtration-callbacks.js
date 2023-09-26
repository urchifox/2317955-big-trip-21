import {isFutureDate, isPastDate, isTodayDate} from './dates';

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

export {showAll, showFuture, showPresent, showPast};
