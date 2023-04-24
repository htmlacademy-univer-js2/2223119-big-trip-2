import { render, replace, remove } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointsPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onOpenEditClick: this.#handleOpenEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#editPointComponent = new EditPointView({
      point: this.#point,
      onCloseEditClick: this.#handleCloseEditClick
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  }

  #handleCloseEditClick = () => {
    this.#replaceEditToPoint();
  };

  #handleOpenEditClick = () => {
    this.#replacePointToEdit();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
