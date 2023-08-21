import { isFutureDate, isPastDate, isTodayDate } from './dates';

const FiltersOption = {
  'EVERYTHING': (points) => points.filter((point) => point),
  'FUTURE'    : (points) => points.filter((point) => isFutureDate(point.periodStart)),
  'PRESENT'   : (points) => points.filter((point) => (isPastDate(point.periodStart) || isTodayDate(point.periodStart)) && (isFutureDate(point.periodEnd) || isTodayDate(point.periodEnd))),
  'PAST'      : (points) => points.filter((point) => isPastDate(point.periodEnd)),
};

function calculateFilters(points) {
  const calculatedFilters = {};
  for (const option in FiltersOption) {
    calculatedFilters[option] = FiltersOption[option](points).length;
  }
  return calculatedFilters;
}

export {calculateFilters};
