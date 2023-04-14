import { render } from './framework/render.js';
import MenuView from './view/menu-view.js';
import FilterView from './view/filters-view.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/points-model.js';
import { generateFilters } from './mock/filters.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const pontsContainer = document.querySelector('.trip-events');

const points = new PointsModel();

const filters = generateFilters(points.points);
const presenter = new PointsPresenter();

render(new MenuView, menuContainer);
render(new FilterView(filters), filterContainer);

presenter.init(pontsContainer, points);
