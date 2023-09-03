import {RenderPosition, render} from './framework/render.js';
import TripSummaryView from './views/trip-summary-view.js';
import FiltrationView from './views/filtration-view.js';
import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import { calculateFilters } from './utils/filters.js';

const tripSummaryContainer = document.querySelector('.trip-controls');
const filtrationContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

console.log('pointsModel :>> ', pointsModel.points);
console.log('offersModel :>> ', offersModel.allOffers);
console.log('destinationsModel :>> ', destinationsModel.destinations);

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

const filtersInformation = calculateFilters(pointsModel.points);

render(new TripSummaryView(), tripSummaryContainer, RenderPosition.BEFOREBEGIN);
render(new FiltrationView({filtersInformation}), filtrationContainer);

boardPresenter.init();
