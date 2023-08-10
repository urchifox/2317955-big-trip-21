import View from './view.js';

function createTemplate() {
  return `
  <ul class="trip-events__list">
  </ul>
  `;
}

export default class ListView extends View {

  getTemplate() {
    return createTemplate();
  }
}
