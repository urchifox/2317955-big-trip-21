import { DEFAULT_NO_POINT_MESSAGE } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(message) {
  /*
    Значение отображаемого текста зависит от выбранного фильтра:
      * Everthing – 'Click New Event to create your first point'
      * Past — 'There are no past events now';
      * Present — 'There are no present events now';
      * Future — 'There are no future events now'.
  */
  return `
    <p class="trip-events__msg">
      ${message}
    </p>
  `;
}

export default class NoPointsView extends AbstractView {
  #message = DEFAULT_NO_POINT_MESSAGE;

  setMessage(message = DEFAULT_NO_POINT_MESSAGE) {
    this.#message = message;
  }

  get template() {
    return createTemplate(this.#message);
  }
}
