import {AUTHORIZATION, END_POINT} from './const.js';
import PointsModel from './models/points-model.js';
import PointApiService from './api-services/point-api-service.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import FiltrationModel from './models/filtration-model.js';
import BoardPresenter from './presenters/board-presenter.js';
import SummaryPresenter from './presenters/summary-presenter.js';
import FiltrationPresenter from './presenters/filtration-presenter.js';

const headerContainer = document.querySelector('.trip-main');
const tripSummaryContainer = headerContainer.querySelector('.trip-controls');
const filtrationContainer = headerContainer.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');

const pointApiService = new PointApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  pointApiService: pointApiService
});
const offersModel = new OffersModel({
  offersApiService: pointApiService
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: pointApiService
});
const filtrationModel = new FiltrationModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainer,
  newPointButtonContainer: headerContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filtrationModel,
});
boardPresenter.init();

const summaryPresenter = new SummaryPresenter({
  summaryContainer: tripSummaryContainer,
  pointsModel,
  offersModel,
  destinationsModel
});
summaryPresenter.init();

const filtrationPresenter = new FiltrationPresenter({
  filtrationContainer,
  filtrationModel,
  pointsModel,
});
filtrationPresenter.init();

Promise.all([
  offersModel.init(),
  destinationsModel.init(),
]).then(() => pointsModel.init());
