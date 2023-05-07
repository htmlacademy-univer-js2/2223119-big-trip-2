function returnDestanition(destinations, allDestinations){
  const destanitionCity = allDestinations.filter((item) => item.id === destinations || item.name === destinations);
  return destanitionCity[0];
}

export { returnDestanition };
