import { render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointView from '../view/no-point-view.js';

export default class PointsPresenter {
  #container;
  #listPoints;
  #routesModel;
  #points;

  constructor() {
    this.#listPoints = new ListPointsView();
  }

  init(container, pointsModel) {
    this.#container = container;
    this.#routesModel = pointsModel;
    this.#points = [...this.#routesModel.points];

    if (this.#points.length === 0) {
      render(new NoPointView(), this.#listPoints.element);
    } else {
      render(new SortingView(), this.#container);
      render(this.#listPoints, this.#container);
      this.#points.forEach((point) => this.#createPoint(point));
    }
  }

  #replaceComponents(firstComponent, secondComponent) {
    replace(firstComponent, secondComponent);
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceComponents();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #createPoint(point) {
    const pointComponent = new PointView(point);
    const editPointComponent = new EditPointView(point);

    pointComponent.setEditClickHandler(() => {
      this.#replaceComponents(editPointComponent, pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    editPointComponent.setPointClickHandler(() => {
      this.#replaceComponents(pointComponent, editPointComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    editPointComponent.setSubmitHandler(() => {
      this.#replaceComponents(pointComponent, editPointComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    render(pointComponent, this.#listPoints.element);
  }
}
