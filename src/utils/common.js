function isFormValid(point) {
  return point.destination !== ''
    && point.basePrice !== ''
    && point.basePrice >= 0
    && point.dateFrom !== undefined
    && point.dateTo !== undefined
    && point.dateFrom < point.dateTo;
}

export {
  isFormValid
};
