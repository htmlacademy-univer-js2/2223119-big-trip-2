import { render } from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';
import InformationPresenter from './presenter/information-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS6sfS59pol1sa2j';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({ pointsApiService: pointsApiService });
const filterModel = new FilterModel();

const informationPresenter = new InformationPresenter({
  tripContainer: siteHeaderElement,
  pointModel: pointsModel
});
const filterPresenter = new FiltersPresenter({
  filterContainer,
  filterModel,
  pointsModel
});
const boardPresenter = new BoardPresenter({
  boardContainer,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});


const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

informationPresenter.init();
filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteHeaderElement);
  });
