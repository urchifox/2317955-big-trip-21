function isFormValid(point) {
  return point.destination !== ''
    && point.basePrice > 0
    && point.dateFrom !== undefined
    && point.dateTo !== undefined;
}

function isEscapeKeydown(key) {
  return key === 'Escape';
}

function makeFirstLetterCaptital(str) {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
}

export {
  isFormValid,
  isEscapeKeydown,
  makeFirstLetterCaptital,
};
