import dayjs from 'dayjs';

function sortByDay(pointA, pointB) {
  return pointA.periodStart - pointB.periodStart;
}

function sortByTime(pointA, pointB) {
  const startDateA = dayjs(pointA.periodStart);
  const endDateA = dayjs(pointA.periodEnd);
  const durationA = endDateA.diff(startDateA, 'minute');

  const startDateB = dayjs(pointB.periodStart);
  const endDateB = dayjs(pointB.periodEnd);
  const durationB = endDateB.diff(startDateB, 'minute');

  return durationB - durationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

export {
  sortByDay,
  sortByTime,
  sortByPrice,
};
