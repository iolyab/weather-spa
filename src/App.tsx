import React, { useEffect, useState } from 'react';
import Main from './pages/Main';
import CitiesList from './components/CitiesList';
import { Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks';
import { addCity} from './features/weather/weatherSlice';
import { Route, Routes } from 'react-router-dom';
import CityDetails from './pages/CityDetails';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.weather.cities);
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
    if(!loaded && cities.length === 0) {
      const defaultCities = ['London', 'New York', 'Kyiv'];
      defaultCities.forEach(city => 
          dispatch(addCity(city)));
          setLoaded(true);
    }
}, [loaded, cities, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Routes>
        <Route path="/" element={
          <>
            <Typography variant="h4" align="center" gutterBottom>
              Weather App
            </Typography>
            <Main />
            <CitiesList />
          </>
          }
        />
        <Route path="/city/:name" element={<CityDetails />} />
      </Routes>
    </Container>
  );
};

export default App;
