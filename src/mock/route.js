import { generateRandom } from '../utils.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFER_TITLES = ['Upgrade to a business class', 'Switch to comfort', 'Rent a car', 'Add breakfast', 'Order taxi', 'Add luggage'];
const APPOINTMENTS = [
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
  for (let i = 0; i < TYPES.length; i++) {
    offerByTypes.push({
      type: TYPES[i],
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

const OFFERS = generateOffersArray();
const OFFERS_BY_TYPE = generateOfferTypes();

const generateRoute = () => (
  {
    basePrice: generateRandom(100, 500),
    startDate: '2019-07-11T09:54:56.845Z',
    endDate: '2019-07-15T11:22:13.375Z',
    destination: generateRandom(1, APPOINTMENTS.length),
    isFavorite: Boolean(generateRandom(0, 1)),
    offers: [... new Set(Array.from({ length: generateRandom(0, OFFERS.length) }, () => generateRandom(1, OFFERS.length - 1)))],
    type: TYPES[generateRandom(0, TYPES.length - 1)],
  });

export { generateRoute, APPOINTMENTS, OFFERS_BY_TYPE, OFFERS};
