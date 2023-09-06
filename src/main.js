import {RenderPosition, render} from './framework/render.js';
import TripSummaryView from './views/trip-summary-view.js';
import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import FiltrationModel from './models/filtration-model.js';
import FiltrationPresenter from './presenters/filtration-presenter.js';

const tripSummaryContainer = document.querySelector('.trip-controls');
const filtrationContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filtrationModel = new FiltrationModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filtrationModel
});

const filterPresenter = new FiltrationPresenter({
  filtrationContainer,
  filtrationModel,
  pointsModel
});

render(new TripSummaryView(), tripSummaryContainer, RenderPosition.BEFOREBEGIN);

filterPresenter.init();
boardPresenter.init();
