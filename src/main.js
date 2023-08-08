import './views/brief-view.js';
import './views/filter-view.js';

/**
 * @type {import('./views/brief-view').default}
 */
const briefView = document.querySelector('brief-view');

briefView.render();

/**
 * @type {import('./views/filter-view').default}
 */
const filterView = document.querySelector('filter-view');

filterView.render();
