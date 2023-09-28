import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleButtonClick = null;

  constructor({onClick}) {
    super();
    this.#handleButtonClick = onClick;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createTemplate();
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
