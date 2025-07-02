import React from 'react';
import Main from './components/Main';
import CityList from './components/CityList';
import { Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Weather App
      </Typography>
      <Main />
      <CityList />
    </Container>
  );
};

export default App;
