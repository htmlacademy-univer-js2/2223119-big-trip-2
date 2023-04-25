import { render } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';
import PointsPresenter from './points-presenter.js';
import { updateItem, sortByPrice, sortByTime } from '../utils/common.js';
import { SORTING_TYPES } from '../utils/constants.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #listPointsComponent = new ListPointsView();
  #sortComponent = null;
  #noPointComponent = new NoPointView();

  #currentSortType = SORTING_TYPES.DEFAULT;
  #sourcedBoardPoints = [];

  #points = [];
  #pointsPresenters = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedTask) => {
    this.#points = updateItem(this.#points, updatedTask);
    this.#pointsPresenters.get(updatedTask.id).init(updatedTask);
  };

  #sortTasks(sortType) {
    switch (sortType) {
      case SORTING_TYPES.PRICE:
        this.#points.sort(sortByPrice);
        break;
      case SORTING_TYPES.TIME:
        this.#points.sort(sortByTime);
        break;
      default:
        this.#points = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearTaskList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container);
  }

  #renderPoint = (point) => {
    const pointPrsenter = new PointsPresenter({
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange
    });
    pointPrsenter.init(point);
    this.#pointsPresenters.set(point.id, pointPrsenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };


  #clearTaskList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #renderPointsList() {
    render(this.#listPointsComponent, this.#container);
    this.#renderPoints(this.#points);
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#listPointsComponent.element);
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
