import dayjs from 'dayjs';
import { RenderPosition, remove, render, replace } from '../framework/render';
import { getMaxDate } from '../utils/dates';
import TripSummaryView from '../views/trip-summary-view';

export default class TripSummaryPresenter {
  #summaryComponent = null;
  #summaryContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({summaryContainer, pointsModel, offersModel, destinationsModel}) {
    this.#summaryContainer = summaryContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if (this.#pointsModel.points.length === 0 || this.#pointsModel.isFailed || this.#offersModel.isFailed || this.#destinationsModel.isFailed) {
      remove(this.#summaryComponent);
      return;
    }

    const prevSummaryComponent = this.#summaryComponent;
    this.#summaryComponent = new TripSummaryView({
      cities: this.#getCities(),
      dates: this.#getDates(),
      wholePrice: this.#getWholePrice(),
    });

    if (prevSummaryComponent === null) {
      render(this.#summaryComponent, this.#summaryContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#summaryComponent, prevSummaryComponent);
    remove(prevSummaryComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #getCities() {
    const points = this.#pointsModel.points;
    const allCities = points.reduce((accumulator, point) => [...accumulator, this.#destinationsModel.getDestinationById(point.destination).name], []);

    if (allCities.length > 3) {
      return `${allCities[0]} &mdash; ... &mdash; ${allCities.at(-1)}`;
    }

    return allCities.join(' &mdash; ');
  }

  #getDates() {
    const points = this.#pointsModel.points;
    const startDate = points[0].dateFrom;
    const startMonth = dayjs(startDate).get('month');
    const allEndDates = points.reduce((accumulator, point) => [...accumulator, point.dateTo], []);
    const endDate = getMaxDate(allEndDates);
    const endMonth = dayjs(endDate).get('month');

    return `${dayjs(startDate).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(endDate).format((startMonth === endMonth ? 'DD' : 'DD MMM'))}`;
  }

  #getWholePrice() {
    const points = this.#pointsModel.points;
    const allPointsPrice = points.reduce((sum, point) => sum + point.basePrice, 0);
    const allOffersIds = points.reduce((accumulator, point) => [...accumulator, ...point.offers], []);
    const allOffers = this.#offersModel.getOffersByIds(allOffersIds);
    const allOffersSum = allOffers.reduce((sum, offer) => sum + offer.price, 0);

    return allPointsPrice + allOffersSum;
  }
}
