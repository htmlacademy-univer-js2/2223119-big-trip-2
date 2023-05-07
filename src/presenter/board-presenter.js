import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import PointsPresenter from './points-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/constants.js';
import { SortDay, sortPrice, sortTime } from '../utils/date.js';
import { filtersTypes } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listPointsComponent = new ListPointsView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noPointComponent = null;

  #pointsPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({boardContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredTasks = filtersTypes[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredTasks.sort(SortDay);
      case SortType.TIME:
        return filteredTasks.sort(sortTime);
      case SortType.PRICE:
        return filteredTasks.sort(sortPrice);
    }

    return this.#pointsModel.points;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer);
  }

  #renderPoint = (point) => {
    const pointPrsenter = new PointsPresenter({
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPrsenter.init(point, this.offers, this.destinations);
    this.#pointsPresenters.set(point.id, pointPrsenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#listPointsComponent, this.#boardContainer);
    this.#renderPoints(this.points);
  }
}
