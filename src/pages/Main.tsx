import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAppDispatch } from '../hooks';
import { addCity } from '../features/weather/weatherSlice';

const Main: React.FC = () => {
  const [city, setCity] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim().length < 2) return;
    dispatch(addCity(city));
    setCity('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <TextField
        label="Find the city..."
        variant="outlined"
        size="small"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
      />
      <Button variant="contained" type="submit">
        Add
      </Button>
    </Box>
  );
};

export default Main;
