import Main from './pages/Main';
import CitiesList from './components/CitiesList';
import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks';
import { Route, Routes } from 'react-router-dom';
import CityDetails from './pages/CityDetails';
import classes from './App.module.scss';

const App: React.FC = () => {

  return (
      <Routes>
        <Route path="/" element={
          <div className={classes.container}>
            <Typography variant="h4" align="center" gutterBottom>
              Weather App
            </Typography>
            <Main />
            <CitiesList />
          </div>
          }
        />
        <Route path="/city/:name" element={<CityDetails />} />
      </Routes>
  );
};

export default App;
