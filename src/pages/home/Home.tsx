import React from 'react';
import { Typography } from '@mui/material';
import Main from '../main/Main';
import CitiesList from '../../components/cities-list/CitiesList';
import classes from './home.module.scss';

const Home = () => {
  return (
    <div className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Weather App
      </Typography>
      <Main />
      <CitiesList />
    </div>
  );
};

export default Home;
