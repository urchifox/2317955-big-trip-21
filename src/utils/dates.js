import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

function getFormattedDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

function getDuration(date1, date2) {
  const startDate = dayjs(date1);
  const endDate = dayjs(date2);
  const differenceInMinutes = endDate.diff(startDate, 'minute');

  const years = Math.floor(differenceInMinutes / 525960);
  const months = Math.floor(differenceInMinutes % 525960 / 43800);
  const days = Math.floor(differenceInMinutes % 43800 / 1440);
  const hours = Math.floor(differenceInMinutes % 1440 / 60);
  const minutes = Math.floor(differenceInMinutes % 60 / 1);

  let message = '';
  message += (years > 0) ? `${years}Y ` : '';
  message += (months > 0) ? `${months}M ` : '';
  message += (days > 0) ? `${days}D ` : '';
  message += (hours > 0) ? `${hours}H ` : '';
  message += (minutes > 0) ? `${minutes}M` : '';

  return message;
}

function getMinDate(date1, date2) {
  dayjs.extend(minMax);
  return dayjs.min(dayjs(date1), dayjs(date2));
}
function getMaxDate(date1, date2) {
  dayjs.extend(minMax);
  return dayjs.max(dayjs(date1), dayjs(date2));
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

export {
  getFormattedDate,
  getDuration,
  getMinDate,
  getMaxDate,
  isFutureDate,
  isTodayDate,
  isPastDate,
};
