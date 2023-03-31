import { render } from './render.js';
import MenuView from './view/menu.js';
import FilterView from './view/filters.js';
import RenderingComponents from './presenter/rendering-components.js';


const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const presenter = new RenderingComponents();

render(new MenuView, menuContainer);
render(new FilterView, filterContainer);

presenter.init(tripContainer);
