import { render, remove, RenderPosition } from '../framework/render.js';
import InformationView from '../view/information-view.js';

export default class InformationPresenter {
  #informationContainer = null;
  #informationComponent = null;
  #pointModel = null;

  constructor({ tripContainer, pointModel }) {
    this.#informationContainer = tripContainer;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointModel.points;
    const allDestinations = this.#pointModel.destinations;

    console.log(this.#informationComponent)

    if (this.#informationComponent) {
      console.log(1)
      this.#informationComponent = null;
    }
    console.log(this.#informationComponent)

    this.#informationComponent = new InformationView({
      points: points,
      allDestinations: allDestinations
    });
    this.#renderInformation();
  }

  #renderInformation(){
    const points = this.#pointModel.points;
    if(points.length){
      render(this.#informationComponent, this.#informationContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };
}
