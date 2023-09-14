function isFormValid(point) {
  return point.destination !== ''
    && point.basePrice > 0
    && point.dateFrom !== undefined
    && point.dateTo !== undefined
    && point.dateFrom < point.dateTo;
}

function isEscapeKeydown(key) {
  return key === 'Escape';
}

export {
  isFormValid,
  isEscapeKeydown
};
