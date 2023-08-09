import { RenderPosition, render } from './render.js';
import TripSummary from './views/trip-summary-view.js';
import Filter from './views/filters-view.js';

const tripSummaryRoot = document.querySelector('.trip-controls');
const filtersRoot = document.querySelector('.trip-controls__filters');

render(new TripSummary(), tripSummaryRoot, RenderPosition.BEFOREBEGIN);
render(new Filter(), filtersRoot);
