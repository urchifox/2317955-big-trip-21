import { POINT_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { getFormattedDate } from '../utils/dates.js';

function createOffersSection(point, offersModel) {
  const offers = offersModel.offers.filter((offer) => offer.type === point.type);

  if (offers.length === 0) {
    return '';
  }

  const offersMarkup = offers.map((offer) => /*html*/`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${point.id}${offer.id}" type="checkbox" name="event-offer-luggage" ${point.chosenOffers.includes(offer.id) ? 'checked="' : ''} ">
      <label class="event__offer-label" for="event-offer-luggage-${point.id}${offer.id}">
        <span class="event__offer-title">${offer.name}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join(' ');

  return /*html*/`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>
  `;
}

function createDestinationSection(destination) {
  if (!destination.description && !destination.pictures) {
    return '';
  }

  const picturesMarkup = destination.pictures.map((picture) => `<img class="event__photo" src="${picture}" alt="Event photo"></img>`).join(' ');

  return /*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesMarkup}
        </div>
      </div>
    </section>
  `;
}

function createTemplate(point, offers, destination, offersModel, destinationsModel) {

  const dateStart = getFormattedDate(point.periodStart, 'DD/MM/YY HH:mm');
  const dateEnd = getFormattedDate(point.periodEnd, 'DD/MM/YY HH:mm');

  const pointIconMarkup = POINT_TYPES.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${point.id}">${type}</label>
      </div>
    `).join(' ');

  const destinationsNamesMarkup = destinationsModel.allDestinationsNames.map((destinationName) => `<option value="${destinationName}"></option>`).join(' ');

  return /*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${pointIconMarkup}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsNamesMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €${point.price}
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${ createOffersSection(point, offersModel)}
          ${createDestinationSection(destination)}
        </section>
      </form>
    </li>
  `;
}

export default class EditingView extends AbstractView {
  #point = null;
  #offers = null;
  #destination = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleFormSubmit = null;

  constructor({point, offers, destination, onFormSubmit, offersModel, destinationsModel}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#handleFormSubmit = onFormSubmit;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createTemplate(this.#point, this.#offers, this.#destination, this.#offersModel, this.#destinationsModel);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
