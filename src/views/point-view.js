import { getFormattedDate, getDuration } from '../utils.js';
import View from './view.js';

function getOffers(offersModel, chosenOffersIds) {
  const chosenOffers = [];
  chosenOffersIds.forEach((chosenId) => {
    const chosenOffer = offersModel.find((offer) => offer.id === chosenId);
    if (chosenOffer) {
      chosenOffers.push(chosenOffer);
    }
  });
  return chosenOffers;
}

function getOffersTemplate(offers) {
  let markup = '';
  offers.forEach((offer) => {
    markup += `
      <li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `;
  });
  return markup;
}

function createTemplate(point, offersModel, destinationsModel) {
  const {type, destinationId, periodStart, periodEnd, price, isFavorite, chosenOffers: chosenOffersIds} = point;

  const dateStart = getFormattedDate(periodStart, 'MMM DD');
  const timeStart = getFormattedDate(periodStart, 'HH:mm');
  const timeEnd = getFormattedDate(periodEnd, 'HH:mm');
  const duration = getDuration(periodStart, periodEnd);
  const favoriteClass = (isFavorite) ? 'event__favorite-btn--active' : '';
  const pointType = type.toLowerCase();

  const destinationName = destinationsModel.find((destination) => destination.id === destinationId).name;

  const chosenOffers = getOffers(offersModel, chosenOffersIds);
  const offersMarkup = getOffersTemplate(chosenOffers);


  return /*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${dateStart}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${timeStart}</time>
            —
            <time class="event__end-time" datetime="2019-03-18T11:00">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class PointView extends View {
  constructor ({point, offersModel, destinationsModel}) {
    super();
    this.point = point;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  getTemplate() {
    return createTemplate(this.point, this.offersModel, this.destinationsModel);
  }
}
