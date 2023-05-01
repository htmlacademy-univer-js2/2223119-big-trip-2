import { nanoid } from 'nanoid';
import { generateRandom } from '../utils/common.js';
import { POINTS_TYPES } from '../utils/constants.js';

const OFFER_TITLES = ['Upgrade to a business class', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Order taxi', 'Add luggage'];
const DESTINATION = [
  {
    id: 1,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'Moscow',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?r=1',
        description: 'Cras aliquet varius magna, non porta ligula feugiat eget.'
      }
    ]
  },
  {
    id: 2,
    description: 'Fusce tristique felis at fermentum pharetra.',
    name: 'Ekaterinburg',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?r=2',
        description: 'Aliquam id orci ut lectus varius viverra.'
      }
    ]
  },
  {
    id: 3,
    description: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    name: 'Saint-Petersburg',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?r=3',
        description: 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
      }
    ]
  }
];

const generateOfferTypes = () => {
  const offerByTypes = [];
  for (let i = 0; i < POINTS_TYPES.length; i++) {
    offerByTypes.push({
      type: POINTS_TYPES[i],
      offers: [... new Set(Array.from({ length: generateRandom(1, OFFER_TITLES.length) }, () => generateRandom(1, OFFER_TITLES.length - 1)))]
    });
  }

  return offerByTypes;
};

const generateOffersArray = () => {
  const offers = [];
  for (let i = 0; i < OFFER_TITLES.length; i++) {
    offers.push({
      id: i + 1,
      title: OFFER_TITLES[i],
      price: generateRandom(50, 300)
    });
  }

  return offers;
};

const OFFERS_BY_TYPE = generateOfferTypes();
const OFFERS = generateOffersArray();

const generatePoint = () => (
  {
    basePrice: generateRandom(100, 500),
    dateFrom: '2019-07-11T09:54:56.845Z',
    dateTo: '2019-07-15T11:22:13.375Z',
    destination: generateRandom(1, DESTINATION.length),
    id: nanoid(),
    isFavorite: false,
    offers: [... new Set(Array.from({ length: generateRandom(0, OFFERS.length) }, () => generateRandom(1, OFFERS.length - 1)))],
    type: POINTS_TYPES[generateRandom(0, POINTS_TYPES.length - 1)],
  });

export { generatePoint, DESTINATION, OFFERS_BY_TYPE, OFFERS};
