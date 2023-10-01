import {AUTHORIZATION, END_POINT} from './const.js';
import PointsModel from './models/points-model.js';
import TripApiService from './trip-api-service.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import FiltrationModel from './models/filtration-model.js';
import BoardPresenter from './presenters/board-presenter.js';
import SummaryPresenter from './presenters/summary-presenter.js';
import FiltrationPresenter from './presenters/filtration-presenter.js';

const headerContainer = document.querySelector('.trip-main');
const summaryContainer = headerContainer.querySelector('.trip-controls');
const filtrationContainer = headerContainer.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');

const tripApiService = new TripApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  tripApiService
});
const offersModel = new OffersModel({
  tripApiService
});
const destinationsModel = new DestinationsModel({
  tripApiService
});
const filtrationModel = new FiltrationModel();

const filtrationPresenter = new FiltrationPresenter({
  filtrationContainer,
  pointsModel,
  filtrationModel,
});
filtrationPresenter.init();

const boardPresenter = new BoardPresenter({
  boardContainer,
  headerContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filtrationModel,
});
boardPresenter.init();

const summaryPresenter = new SummaryPresenter({
  container: summaryContainer,
  pointsModel,
  offersModel,
  destinationsModel
});
summaryPresenter.init();

Promise.all([
  offersModel.init(),
  destinationsModel.init(),
]).then(() => pointsModel.init());
