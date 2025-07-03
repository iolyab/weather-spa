import React from 'react';
import { useAppSelector } from '../hooks';
import CityCard from './CityCard'
import { selectCities } from '../features/weather/selectors';

const CitiesList: React.FC = () => {
  const cities = useAppSelector(selectCities);

  return (
    <>
      {cities.map((city) => (
        <CityCard key={city.city} city={city} />
      ))}
    </>
  );
};

export default CitiesList;

