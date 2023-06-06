import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import InformationView from '../view/information-view.js';
import SortView from '../view/sort-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortDay, sortPrice, sortTime } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../utils/constants.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #siteHeaderElement = null;
  #boardContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #informationComponent = null;
  #listPointsComponent = new ListPointsView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noPointComponent = null;
  #newPointButtonComponent = null;

  #pointsPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ siteHeaderElement, boardContainer, pointsModel, filterModel }) {
    this.#siteHeaderElement = siteHeaderElement;
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints;
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

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
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
        } catch {
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
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#createNewPointPresenter();
        this.#renderNewPointButton(false);
        this.#renderBoard();
        break;
    }
  };

  #createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  };

  #createNewPointPresenter = () => {
    this.#newPointPresenter = new NewPointPresenter({
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
      pointListContainer: this.#listPointsComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #renderNewPointButton = () => {
    if (this.#newPointButtonComponent === null) {
      this.#newPointButtonComponent = new NewPointButtonView({ onClick: this.#handleNewPointButtonClick });
    }
    render(this.#newPointButtonComponent, this.#siteHeaderElement, RenderPosition.BEFOREEND);
  };

  #renderInformation = () => {
    if (this.#informationComponent === null) {
      this.#informationComponent = new InformationView({
        points: this.#pointsModel.points,
        allDestinations: this.#pointsModel.destinations
      });
    }
    render(this.#informationComponent, this.#siteHeaderElement, RenderPosition.AFTERBEGIN);
  };

  #clearInformation = () => {
    remove(this.#informationComponent);
    this.#informationComponent = null;
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
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint = (point) => {
    const pointPrsenter = new PointPresenter({
      allOffers: this.#pointsModel.offers,
      allDestinations: this.#pointsModel.destinations,
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

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    this. #clearInformation();
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
    this.#renderInformation();
    this.#renderPoints(this.points);
  }
}
