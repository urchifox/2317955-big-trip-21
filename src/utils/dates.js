import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

function getFormattedDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

function getDuration(date1, date2) {
  const startDate = dayjs(date1);
  const endDate = dayjs(date2);
  const differenceInMinutes = endDate.diff(startDate, 'minute');

  const days = Math.floor(differenceInMinutes / 1440);
  const hours = Math.floor(differenceInMinutes % 1440 / 60);
  const minutes = Math.floor(differenceInMinutes % 60 / 1);

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else {
    if (hours > 0) {
      return `${hours}H ${minutes}M`;
    }
  }

  return `${minutes}M`;
}

function getMinDate(date1, date2) {
  dayjs.extend(minMax);
  return dayjs.min(dayjs(date1), dayjs(date2));
}

function getMaxDate(dates) {
  dayjs.extend(minMax);
  let maxDate = dates[0];
  for (let i = 1; i < dates.length; i++) {
    const newMaxDate = dayjs.max(dayjs(maxDate), dayjs(dates[i]));
    maxDate = newMaxDate;
  }
  return maxDate;
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
