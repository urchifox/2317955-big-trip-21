import {filterOption} from '../utils/filters.js';

// function generateFilter(points) {
//   return Object.entries(filterOption).map(
//     ([filterType, filterPoints]) => ({
//       type: filterType,
//       count: filterPoints(points).length,
//     }),
//   );
// }

function generateFilter(points) {
  const calculatedFilters = {};
  for (const option in filterOption) {
    calculatedFilters[option] = filterOption[option](points).length;
  }
  return calculatedFilters;
}

export {generateFilter};
