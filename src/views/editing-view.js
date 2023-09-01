import { POINT_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { getFormattedDate } from '../utils/dates.js';

function createOffersTemplate(point, offersByType) {
  if (offersByType.length === 0) {
    return '';
  }

  const offersTemplate = offersByType.map((offer) => /*html*/`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" type="checkbox" name="event-offer-luggage"
        id="event-offer-luggage-${point.id}${offer.id}"
        ${point.chosenOffers.includes(offer.id) ? 'checked="' : ''} ">
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
        ${offersTemplate}
      </div>
    </section>
  `;
}
function createPicturesTemplate(pictures) {
  if (pictures.length === 0) {
    return '';
  }
  const picturesTemplate = pictures.map((picture) => /*html*/`
    <img class="event__photo" src="${picture}" alt="Event photo"></img>
  `).join(' ');

  return /*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesTemplate}
      </div>
    </div>`;
}

function createDestinationTemplate(pointDestination) {
  if (!pointDestination.description && !pointDestination.pictures) {
    return '';
  }

  const descriptionTemplate = pointDestination.description.length === 0 ? '' :
    `<p class="event__destination-description">
      ${pointDestination.description}
    </p>`;

  return /*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionTemplate}
      ${createPicturesTemplate(pointDestination.pictures)}
    </section>
  `;
}

function createTemplate(point, pointDestination, offersByType, allDestinationsNames) {
  const dateStart = getFormattedDate(point.periodStart, 'DD/MM/YY HH:mm');
  const dateEnd = getFormattedDate(point.periodEnd, 'DD/MM/YY HH:mm');

  const pointIconTemplate = POINT_TYPES.map((type) => /*html*/`
      <div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${point.id}">${type}</label>
      </div>
    `).join(' ');

  const destinationsNamesTemplate = allDestinationsNames.map((destinationName) => /*html*/`
    <option value="${destinationName}"></option>
    `).join(' ');

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
                ${pointIconTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsNamesTemplate}
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
          ${createOffersTemplate(point, offersByType)}
          ${createDestinationTemplate(pointDestination)}
        </section>
      </form>
    </li>
  `;
}

export default class EditingView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #offersByType = null;
  #allDestinationsNames = null;
  #handleFormSubmit = null;

  constructor({point, pointDestination, onFormSubmit, offersByType, allDestinationsNames}) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#handleFormSubmit = onFormSubmit;
    this.#offersByType = offersByType;
    this.#allDestinationsNames = allDestinationsNames;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);

  }

  get template() {
    return createTemplate(this.#point, this.#pointDestination, this.#offersByType, this.#allDestinationsNames);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };
}
