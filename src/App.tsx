import React, { useEffect, useState } from 'react';
import Main from './pages/Main';
import CitiesList from './components/CitiesList';
import { Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks';
import { addCity} from './features/weather/weatherSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const cities = useAppSelector(state => state.weather.cities);
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
    if(!loaded) {
      cities.forEach(city => {
        if(city.loading) {
          dispatch(addCity(city.city));
    }
    });
    setLoaded(true);
  }
}, [loaded, cities, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Weather App
      </Typography>
      <Main />
      <CitiesList />
    </Container>
  );
};

export default App;
