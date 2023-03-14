import { render } from './render';
import FilterView from './view/filters';
import RenderingComponents from './presenter/rendering_components';

const FILTER_CONTAINER = document.querySelector('.trip-controls__filters');
const TRIP_CONTAINER = document.querySelector('.trip-events');

const presenter = new RenderingComponents({container: TRIP_CONTAINER});

render(new FilterView(), FILTER_CONTAINER);
presenter.init();
