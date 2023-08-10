import { RenderPosition, render } from './render.js';
import TripSummaryView from './views/trip-summary-view.js';
import FiltrationView from './views/filtration-view.js';
import SortingView from './views/sorting-view.js';
import ListPresenter from './presenters/list-presenter.js';

const tripSummaryRoot = document.querySelector('.trip-controls');
const filtrationRoot = document.querySelector('.trip-controls__filters');
const listRoot = document.querySelector('.trip-events');
const listPresenter = new ListPresenter({listContainer: listRoot});

render(new TripSummaryView(), tripSummaryRoot, RenderPosition.BEFOREBEGIN);
render(new FiltrationView(), filtrationRoot);
render(new SortingView(), listRoot);

listPresenter.init();
