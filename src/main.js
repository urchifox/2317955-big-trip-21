import {RenderPosition, render} from './framework/render.js';
import TripSummaryView from './views/trip-summary-view.js';
import FiltrationView from './views/filtration-view.js';
import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import { calculateFilters } from './utils/filters.js';

const tripSummaryRoot = document.querySelector('.trip-controls');
const filtrationRoot = document.querySelector('.trip-controls__filters');
const boardRoot = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardRoot,
  pointsModel,
  offersModel,
  destinationsModel
});

const filtersInformation = calculateFilters(pointsModel.points);

render(new TripSummaryView(), tripSummaryRoot, RenderPosition.BEFOREBEGIN);
render(new FiltrationView({filtersInformation}), filtrationRoot);

boardPresenter.init();
