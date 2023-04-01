import { render } from '../render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import PointsModel from '../model/point-model.js';

export default class PointPresenter {
  constructor() {
    this._container = null;
    this._listRoutes = new ListPointsView();
    this._routesModel = null;
    this._points = null;
  }

  init(container) {
    this._container = container;
    this._routesModel = new PointsModel();
    this._points = [...this._routesModel.points];

    render(new SortingView(), this._container);
    render(this._listRoutes, this._container);

    this._openEdit = (editPointComponent, pointComponent) => {
      this._listRoutes.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    this._closeEdit = (editPointComponent, pointComponent) => {
      this._listRoutes.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    this._escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this._closeEdit();
        document.removeEventListener('keydown', this._escKeyDownHandler);
      }
    };

    this._createPoint = (point) => {
      const pointComponent = new PointView(point);
      const editPointComponent = new EditPointView(point);

      pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        this._openEdit(editPointComponent, pointComponent);
        document.addEventListener('keydown', this._escKeyDownHandler);
      });

      editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        this._closeEdit(editPointComponent, pointComponent);
        document.removeEventListener('keydown', this._escKeyDownHandler);
      });

      editPointComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
        evt.preventDefault();
        this._closeEdit();
        document.removeEventListener('keydown', this._escKeyDownHandler);
      });

      render(pointComponent, this._listRoutes.element);
    };

    this._points.forEach((point) => this._createPoint(point));
  }
}
