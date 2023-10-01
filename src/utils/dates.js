import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;

function getFormattedDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

function getDuration(date1, date2) {
  const startDate = dayjs(date1);
  const endDate = dayjs(date2);
  return endDate.diff(startDate, 'minute');
}

function isFutureDate(date) {
  return date && dayjs(date).isAfter(dayjs(), 'D');
}

function isTodayDate(date) {
  return date && dayjs(date).isSame(dayjs(), 'D');
}

function isPastDate(date) {
  return date && dayjs(date).isBefore(dayjs(), 'D');
}

function addMinutes(date, minutes) {
  const dateCopy = new Date(date);
  dateCopy.setMinutes(date.getMinutes() + minutes);
  return dateCopy;
}

function formateDuration(durationInMinutes) {
  const days = Math.floor(durationInMinutes / MINUTES_IN_DAY);
  const hours = Math.floor(durationInMinutes % MINUTES_IN_DAY / MINUTES_IN_HOUR);
  const minutes = Math.floor(durationInMinutes % MINUTES_IN_HOUR);

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
}

export {
  getFormattedDate,
  getDuration,
  isFutureDate,
  isTodayDate,
  isPastDate,
  addMinutes,
  formateDuration,
};
