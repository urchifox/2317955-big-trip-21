function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function isFormValid(point) {
  return point.destination !== ''
    && point.basePrice !== ''
    && point.basePrice >= 0
    && point.dateFrom !== undefined
    && point.dateTo !== undefined
    && point.dateFrom < point.dateTo;
}

export {
  updateItem,
  isFormValid
};
