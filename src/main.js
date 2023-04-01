import { render } from './render.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filters-view';
import PointPresenter from './presenter/points-presenter.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const pontContainer = document.querySelector('.trip-events');
const presenter = new PointPresenter();

render(new MenuView, menuContainer);
render(new FilterView, filterContainer);

presenter.init(pontContainer);
