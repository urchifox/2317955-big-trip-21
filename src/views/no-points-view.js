import {DEFAULT_NO_POINT_MESSAGE} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(message) {
  return `
    <p class="trip-events__msg">
      ${message}
    </p>
  `;
}

export default class NoPointsView extends AbstractView {
  #message = DEFAULT_NO_POINT_MESSAGE;

  get template() {
    return createTemplate(this.#message);
  }

  setMessage(message = DEFAULT_NO_POINT_MESSAGE) {
    this.#message = message;
  }
}

