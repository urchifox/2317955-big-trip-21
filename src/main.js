import { RenderPosition, render } from './render.js';
import TripSummaryView from './views/trip-summary-view.js';
import FiltrationView from './views/filtration-view.js';
import SortingView from './views/sorting-view.js';
import ListPresenter from './presenters/list-presenter.js';
import PointsModel from './models/points-model.js';
import OffersModel from './models/offers-model.js';
import DestinationsModel from './models/destinations-model.js';

const tripSummaryRoot = document.querySelector('.trip-controls');
const filtrationRoot = document.querySelector('.trip-controls__filters');
const listRoot = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const listPresenter = new ListPresenter({
  listContainer: listRoot,
  pointsModel,
  offersModel,
  destinationsModel
});

render(new TripSummaryView(), tripSummaryRoot, RenderPosition.BEFOREBEGIN);
render(new FiltrationView(), filtrationRoot);
render(new SortingView(), listRoot);

listPresenter.init();
