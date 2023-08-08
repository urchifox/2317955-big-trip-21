import './views/brief-view.js';
import './views/filter-view.js';
import './views/add-button-view.js';
import './views/sort-view.js';
import './views/list-view.js';
import './views/card-view.js';
import './views/editor-view.js';

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

/**
 * @type {import('./views/list-view').default}
 */
const list = document.querySelector('list-view');

/**
 * @type {import('./views/card-view').default}
 */
const card = document.querySelector('card-view');

/**
 * @type {import('./views/editor-view').default}
 */
const editor = document.querySelector('editor-view');


briefView.render();
filterView.render();
addButton.render();
sortButton.render();
list.render();
// card.render();
// editor.render();
