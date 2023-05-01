import { render } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';
import PointsPresenter from './points-presenter.js';
import { updateItem } from '../utils/common.js';
import { SORTING_TYPES } from '../utils/constants.js';
import { sortPrice, sortTime } from '../utils/date.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #listPointsComponent = new ListPointsView();
  #sortComponent = null;
  #noPointComponent = new NoPointView();

  #currentSortType = SORTING_TYPES.DEFAULT;
  #sourcedBoardPoints = [];
  #sortedTimePoint = [];
  #sortedPricePoint = [];

  #points = [];
  #pointsPresenters = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#sortedTimePoint = [...this.#pointsModel.points];
    this.#sortedPricePoint = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SORTING_TYPES.PRICE:
        this.#points = [...this.#sortedPricePoint].sort(sortPrice);
        break;
      case SORTING_TYPES.TIME:
        this.#points = [...this.#sortedTimePoint].sort(sortTime);
        break;
      default:
        this.#points = [...this.#sourcedBoardPoints];
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#sortedTimePoint = updateItem(this.#sortedTimePoint, updatedPoint);
    this.#sortedPricePoint = updateItem(this.#sortedPricePoint, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) => {
    const pointPrsenter = new PointsPresenter({
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPrsenter.init(point);
    this.#pointsPresenters.set(point.id, pointPrsenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointsList() {
    render(this.#listPointsComponent, this.#container);
    this.#renderPoints(this.#points);
  }

  #clearTaskList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearTaskList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container);
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
