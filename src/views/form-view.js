import { BLANK_POINT, POINT_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';
import { isFormValid } from '../utils/common.js';
import dayjs from 'dayjs';

function createOffersTemplate(point, offers) {
  const offersByType = offers.find((offer) => offer.type === point.type).offers;

  if (offersByType.length === 0) {
    return '';
  }

  const disableStatus = point.isDisabled ? 'disabled' : '';

  const offersTemplate = offersByType.map((offer) => /*html*/`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" type="checkbox" name="event-offer-luggage"
        id="event-offer-${point.id ? he.encode(point.id) : ''}-${he.encode(offer.id)}"
        value="${he.encode(offer.id)}"
        ${point.offers.includes(offer.id) ? 'checked' : ''} "
        ${disableStatus}
      >
      <label class="event__offer-label" for="event-offer-${point.id ? he.encode(point.id) : ''}-${he.encode(offer.id)}">
        <span class="event__offer-title">${he.encode(offer.title)}</span>
        +&euro;&nbsp;
        <span class="event__offer-price">${he.encode(String(offer.price))}</span>
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
  const picturesTemplate = pictures.map(({src, description}) => /*html*/`
    <img class="event__photo" src="${he.encode(src)}" alt="${he.encode(description)}"></img>
  `).join(' ');

  return /*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesTemplate}
      </div>
    </div>`;
}

function createDestinationTemplate(pointDestination) {
  if (!pointDestination) {
    return '';
  }

  if (pointDestination.description.length === 0 && pointDestination.pictures.length === 0) {
    return '';
  }

  const descriptionTemplate = pointDestination.description.length === 0 ? '' :
    `<p class="event__destination-description">
      ${he.encode(pointDestination.description)}
    </p>`;

  return /*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionTemplate}
      ${createPicturesTemplate(pointDestination.pictures)}
    </section>
  `;
}

function getSubmitButtonName(point) {
  if (!point.id) {
    return 'Cancel';
  }

  return (point.isDeleting ? 'Deleting...' : 'Delete');
}

function createTemplate(point, allOffers, allDestinations) {
  const pointId = point.id ? he.encode(point.id) : '';
  const pointType = he.encode(point.type);
  const pointPrice = he.encode(String(point.basePrice));
  const pointDestinationInfo = allDestinations.find((destination) => destination.id === point.destination);
  const dateFromFormated = !point.dateFrom ? '' : dayjs(point.dateFrom).format('DD/MM/YY HH:mm');
  const dateToFormated = !point.dateTo ? '' : dayjs(point.dateTo).format('DD/MM/YY HH:mm');

  const disableStatus = point.isDisabled ? 'disabled' : '';

  const pointIconTemplate = POINT_TYPES.map((type) => /*html*/`
      <div class="event__type-item">
        <input class="event__type-input  visually-hidden" type="radio" name="event-type"
          id="event-type-${type.toLowerCase()}-${pointId}"
          value="${type}"
          ${pointType === type.toLowerCase() ? 'checked' : ''}
        >
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${pointId}">${type}</label>
      </div>
    `).join(' ');

  const destinationsNamesTemplate = allDestinations.map((destination) => /*html*/`
    <option value="${he.encode(destination.name)}"></option>
    `).join(' ');

  return /*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" type="checkbox"
              id="event-type-toggle-${pointId}"
              ${disableStatus}
            >

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${pointIconTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${pointType}
            </label>
            <input required class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" required
              value="${he.encode(pointDestinationInfo?.name ?? '')}"
              ${disableStatus}
            >
            <datalist id="destination-list-1">
              ${destinationsNamesTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" required
              value="${dateFromFormated ?? ''}"
              ${disableStatus}
            >
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" required
              value="${dateToFormated ?? ''}"
              ${disableStatus}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" required
              value="${pointPrice}"
              ${disableStatus}
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit"
            ${isFormValid(point) && !point.isDisabled ? '' : 'disabled'}
          >
            ${point.isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset"
            ${disableStatus}
          >
            ${getSubmitButtonName(point)}
           </button>
           ${!pointId ? '' : `<button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>`}
        </header>
        <section class="event__details">
          ${createOffersTemplate(point, allOffers)}
          ${createDestinationTemplate(pointDestinationInfo)}
        </section>
      </form>
    </li>
  `;
}

export default class FormView extends AbstractStatefulView {
  offers = [];
  #allDestinations = [];
  #handleFormSubmit = null;
  #datepickerTo = null;
  #datepickerFrom = null;
  #handleDeleteClick = null;
  #handleCloseClick = null;

  constructor({point = BLANK_POINT, onFormSubmit, offersByType, allDestinations, onDeleteClick, onCloseClick}) {
    super();
    this._setState(FormView.parsePointToState(point));
    this.offers = offersByType;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCloseClick = onCloseClick;
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state, this.offers, this.#allDestinations);
  }

  removeElement() {
    super.removeElement();

    if(this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__details').addEventListener('click', this.#offersChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#formCloseClickHandler);
  }

  reset(point) {
    this.updateElement(FormView.parsePointToState(point),);
  }

  updateElement(update) {
    super.updateElement(update);
    this.setDatePicker();
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(FormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(FormView.parseStateToPoint(this._state));
  };

  #formCloseClickHandler = () => {
    this.#handleCloseClick();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({type: evt.target.value.toLowerCase(), offers: []});
  };

  #destinationChangeHandler = (evt) => {
    const chosenDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    const chosenDestinationId = chosenDestination ? chosenDestination.id : '';

    this.updateElement({destination: chosenDestinationId});
  };

  #priceChangeHandler = (evt) => {
    const newPrice = parseInt(evt.target.value, 10);
    this._setState({basePrice: (Number.isNaN(newPrice) ? 0 : newPrice) });
    this.element.querySelector('.event__save-btn').disabled = !isFormValid(this._state);
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const chosenOffers = this._state.offers;
    const offerId = evt.target.value;
    const offerIndex = chosenOffers.indexOf(offerId);

    if (offerIndex >= 0) {
      chosenOffers.splice(offerIndex, 1);
    } else {
      chosenOffers.push(offerId);
    }

    this._setState({offers: chosenOffers});
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({dateFrom: userDate});
    this.#datepickerTo.set({minDate: this._state.dateFrom});
    this.element.querySelector('.event__save-btn').disabled = !isFormValid(this._state);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({dateTo: userDate});
    this.#datepickerFrom.set({maxDate: this._state.dateTo});
    this.element.querySelector('.event__save-btn').disabled = !isFormValid(this._state);
  };

  setDatePicker() {
    const commonSettings = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true,
    };

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...commonSettings,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...commonSettings,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      },
    );
  }
}
