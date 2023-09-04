import dayjs from 'dayjs';

function sortByDay(pointA, pointB) {
  return pointA.dateFrom - pointB.dateFrom;
}

function sortByTime(pointA, pointB) {
  const startDateA = dayjs(pointA.dateFrom);
  const endDateA = dayjs(pointA.dateTo);
  const durationA = endDateA.diff(startDateA, 'minute');

  const startDateB = dayjs(pointB.dateFrom);
  const endDateB = dayjs(pointB.dateTo);
  const durationB = endDateB.diff(startDateB, 'minute');

  return durationB - durationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export {
  sortByDay,
  sortByTime,
  sortByPrice,
};
