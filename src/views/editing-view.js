import { POINT_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getFormattedDate } from '../utils/dates.js';

function createOffersTemplate(point, allOffers) {
  const offersByType = allOffers.filter((offer) => offer.type === point.type);

  if (offersByType.length === 0) {
    return '';
  }

  const offersTemplate = offersByType.map((offer) => /*html*/`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" type="checkbox" name="event-offer-luggage"
        id="event-offer-${point.id}-${offer.id}"
        value="${offer.id}"
        ${point.offers.includes(offer.id) ? 'checked="' : ''} ">
      <label class="event__offer-label" for="event-offer-${point.id}-${offer.id}">
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

function createTemplate(point, allOffers, allDestinations) {
  const dateStart = getFormattedDate(point.dateFrom, 'DD/MM/YY HH:mm');
  const dateEnd = getFormattedDate(point.dateTo, 'DD/MM/YY HH:mm');

  const pointDestination = allDestinations.find((destination) => destination.id === point.destination);

  const pointIconTemplate = POINT_TYPES.map((type) => /*html*/`
      <div class="event__type-item">
        <input class="event__type-input  visually-hidden" type="radio" name="event-type"
          id="event-type-${type.toLowerCase()}-${point.id}"
          value="${type}"
          ${point.type === type ? 'checked' : ''}
        >
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${point.id}">${type}</label>
      </div>
    `).join(' ');

  const destinationsNamesTemplate = allDestinations.map((destination) => /*html*/`
    <option value="${destination.name}"></option>
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
            <input required class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1"
              value="${pointDestination.name}"
            >
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
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersTemplate(point, allOffers)}
          ${createDestinationTemplate(pointDestination)}
        </section>
      </form>
    </li>
  `;
}

export default class EditingView extends AbstractStatefulView {
  #offersByType = [];
  #allDestinations = [];
  #handleFormSubmit = null;

  constructor({point, onFormSubmit, offersByType, allDestinations}) {
    super();
    this._setState(EditingView.pastePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#offersByType = offersByType;
    this.#allDestinations = allDestinations;
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state, this.#offersByType, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__details').addEventListener('click', this.#offersChangeHandler);
  }

  reset(point) {
    this.updateElement(EditingView.pastePointToState(point),);
  }

  static pastePointToState(point) {
    return {...point,
    };
  }

  static pasteStateToPoint(state) {
    const point = {...state};

    return point;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditingView.pasteStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value, offers: []});
  };

  #destinationChangeHandler = (evt) => {
    const chosenDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    this.updateElement({destination: chosenDestination.id});
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({basePrice: evt.target.value});
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const chosenOffers = this._state.offers;
    const offerId = parseInt(evt.target.value, 10);
    const offerIndex = chosenOffers.indexOf(offerId);


    if (offerIndex >= 0) {
      chosenOffers.splice(offerIndex, 1);
    } else {
      chosenOffers.push(offerId);
    }

    this.updateElement({offers: chosenOffers});
  };
}
