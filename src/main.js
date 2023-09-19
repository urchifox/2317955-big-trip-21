import {render} from './framework/render.js';
import BoardPresenter from './presenters/board-presenter.js';
import PointsModel from './models/points-model.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';
import FiltrationModel from './models/filtration-model.js';
import FiltrationPresenter from './presenters/filtration-presenter.js';
import NewPointButtonView from './views/new-point-button-view.js';
import PointApiService from './api-services/point-api-service.js';
import OffersApiService from './api-services/offers-api-service.js';
import DestinationsApiService from './api-services/destinations-api-service.js';
import TripSummaryPresenter from './presenters/trip-summary-presenter.js';

const AUTHORIZATION = 'Basic evtukhova';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const headerContainer = document.querySelector('.trip-main');
const tripSummaryContainer = headerContainer.querySelector('.trip-controls');
const filtrationContainer = headerContainer.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');


const pointsModel = new PointsModel({pointApiService: new PointApiService(END_POINT, AUTHORIZATION)});
const offersModel = new OffersModel({offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)});
const destinationsModel = new DestinationsModel({destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)});
const filtrationModel = new FiltrationModel();

const boardPresenter = new BoardPresenter({
  boardContainer: boardContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filtrationModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const filtrationPresenter = new FiltrationPresenter({
  filtrationContainer,
  filtrationModel,
  pointsModel,
});

const summaryPresenter = new TripSummaryPresenter({
  summaryContainer: tripSummaryContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

const newPointButton = new NewPointButtonView({onClick: handleNewTaskButtonClick});

function handleNewPointFormClose() {
  newPointButton.element.disabled = false;
}

function handleNewTaskButtonClick() {
  boardPresenter.createPoint();
  newPointButton.element.disabled = true;
}

filtrationPresenter.init();
boardPresenter.init();

Promise.all([
  offersModel.init(),
  destinationsModel.init(),
]).then(() => pointsModel.init())
  .then(() => summaryPresenter.init())
  .finally(() => render(newPointButton, headerContainer));
