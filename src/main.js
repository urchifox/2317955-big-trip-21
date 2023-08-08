import './views/brief-view.js';
import './views/filter-view.js';
import './views/add-button-view.js';
import './views/sort-view.js';

/**
 * @type {import('./views/brief-view').default}
 */
const briefView = document.querySelector('brief-view');

/**
 * @type {import('./views/filter-view').default}
 */
const filterView = document.querySelector('filter-view');

/**
 * @type {import('./views/add-button-view').default}
 */
const addButton = document.querySelector('add-button-view');

/**
 * @type {import('./views/sort-view').default}
 */
const sortButton = document.querySelector('sort-view');


briefView.render();
filterView.render();
addButton.render();
sortButton.render();
