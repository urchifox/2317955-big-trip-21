import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(cities, dates, wholePrice) {
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${wholePrice}</span>
      </p>
    </section>
  `;
}

export default class SummaryView extends AbstractView {
  #cities = '';
  #dates = '';
  #wholePrice = 0;

  constructor ({cities, dates, wholePrice}) {
    super();
    this.#cities = cities;
    this.#dates = dates;
    this.#wholePrice = wholePrice;
  }

  get template() {
    return createTemplate(this.#cities, this.#dates, this.#wholePrice);
  }
}
