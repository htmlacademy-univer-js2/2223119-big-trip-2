import AbsractView from '../framework/view/abstract-view';

function createServerErrorTemplate() {
  return (
    '<p class="trip-events__msg">The server is currently unavailable. Please try again later.</p>'
  );
}


export default class ServerErrorView extends AbsractView {
  get template() {
    return createServerErrorTemplate();
  }
}
