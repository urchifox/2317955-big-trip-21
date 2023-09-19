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
    if (this.#pointsModel.points.length === 0) {
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
    const allCitiesId = points.reduce((accumulator, point) => [...accumulator, point.destination], []);
    const uniqueIds = new Set(allCitiesId);
    const uniqueCities = [];
    uniqueIds.forEach((id) => uniqueCities.push(this.#destinationsModel.getDestinationById(id).name));
    if (uniqueCities.length > 3) {
      return `${uniqueCities[0]} — ... — ${uniqueCities.at(-1)}`;
    }

    return uniqueCities.join(' — ');
  }

  #getDates() {
    const points = this.#pointsModel.points;
    const startDate = points[0].dateFrom;
    const startMonth = dayjs(startDate).get('month');
    const allEndDates = points.reduce((accumulator, point) => [...accumulator, point.dateTo], []);
    const endDate = getMaxDate.apply(null, allEndDates);
    const endMonth = dayjs(endDate).get('month');

    return `${dayjs(startDate).format('MMM DD')} — ${dayjs(endDate).format((startMonth === endMonth ? 'DD' : 'MMM DD'))}`;
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
