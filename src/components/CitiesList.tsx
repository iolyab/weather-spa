import React from 'react';
import { useAppSelector } from '../hooks';
import CityCard from './CityCard'

const CitiesList: React.FC = () => {
  const cities = useAppSelector(state => state.weather.cities);

  return (
    <>
      {cities.map((city) => (
        <CityCard key={city.city} city={city} />
      ))}
    </>
  );
};

export default CitiesList;

