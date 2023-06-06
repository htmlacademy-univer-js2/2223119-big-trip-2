import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType } from '../utils/constants.js';

export default class NewPointPresenter {
  #allOffers = null;
  #allDestinations = null;

  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editPointComponent = null;

  constructor({ allOffers, allDestinations, pointListContainer, onDataChange, onDestroy }) {
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onSaveClick: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCloseEditClick: this.#handleDeleteClick
    });

    render(this.#editPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
