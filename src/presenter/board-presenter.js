import { render } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';
import PointsPresenter from './points-presenter.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #listPointsComponent = new ListPointsView();
  #sortComponent = new SortingView();
  #noPointComponent = new NoPointView();

  #points = [];
  #pointsPresenters = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedTask) => {
    this.#points = updateItem(this.#points, updatedTask);
    this.#pointsPresenters.get(updatedTask.id).init(updatedTask);
  };

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

  // #clearPointList() {
  //   this.#pointsPresenters.forEach((presenter) => presenter.destroy());
  //   this.#pointsPresenters.clear();
  // }

  #renderPointsList() {
    render(this.#listPointsComponent, this.#container);
    this.#renderPoints(this.#points);
  }

  #renderSort() {
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

  // #renderNoTasks() {
  //   this.#noTaskComponent = new NoTaskView({
  //     filterType: this.#filterType
  //   });

  //   render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  // }

  // #replaceComponents(firstComponent, secondComponent) {
  //   replace(firstComponent, secondComponent);
  // }

  // #escKeyDownHandler(evt) {
  //   if (evt.key === 'Escape' || evt.key === 'Esc') {
  //     evt.preventDefault();
  //     this.#replaceComponents();
  //     document.removeEventListener('keydown', this.#escKeyDownHandler);
  //   }
  // }

  // #createPoint(point) {
  //   const pointComponent = new PointView(point);
  //   const editPointComponent = new EditPointView(point);

  //   pointComponent.setEditClickHandler(() => {
  //     this.#replaceComponents(editPointComponent, pointComponent);
  //     document.addEventListener('keydown', this.#escKeyDownHandler);
  //   });

  //   editPointComponent.setPointClickHandler(() => {
  //     this.#replaceComponents(pointComponent, editPointComponent);
  //     document.removeEventListener('keydown', this.#escKeyDownHandler);
  //   });

  //   editPointComponent.setSubmitHandler(() => {
  //     this.#replaceComponents(pointComponent, editPointComponent);
  //     document.removeEventListener('keydown', this.#escKeyDownHandler);
  //   });

  //   render(pointComponent, this.#listPoints.element);
  // }
}
