import { isFutureDate, isPastDate, isTodayDate } from './dates';

const filterOption = {
  'EVERYTHING': (points) => points.filter((point) => point),
  'FUTURE': (points) => points.filter((point) => isFutureDate(point.periodStart)),
  'PRESENT': (points) => points.filter((point) => (isPastDate(point.periodStart) || isTodayDate(point.periodStart)) && (isFutureDate(point.periodEnd) || isTodayDate(point.periodEnd))),
  'PAST': (points) => points.filter((point) => isPastDate(point.periodEnd)),
};

export {filterOption};
