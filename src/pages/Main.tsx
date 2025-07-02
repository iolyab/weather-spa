import React, { useState } from 'react';
import { TextField, Button, Box, Modal, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addCity, closeCityNotFoundModal } from '../features/weather/weatherSlice';

const Main: React.FC = () => {
  const [city, setCity] = useState('');
  const dispatch = useAppDispatch();
  const cityNotFoundModalOpen = useAppSelector((state) => state.weather.errorModalOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim().length < 2) return;
    const resultAction = await dispatch(addCity(city.trim()));

    if (addCity.rejected.match(resultAction)) {
    } else {
      setCity('');
    }
  };

  return (
  <>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Find the city..."
          variant="outlined"
          size="small"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          sx={{ '& .MuiInputBase-input': { p: '12px' } }}
        />
        <Button variant="contained" type="submit">
          Add
        </Button>
      </Box>

      <Modal
        open={cityNotFoundModalOpen}
        onClose={() => dispatch(closeCityNotFoundModal())}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: '80%', sm: 400, md: 500 },
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            City Not Found
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            The city you entered could not be found. Please try again.
          </Typography>
          <Button onClick={() => dispatch(closeCityNotFoundModal())} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  )
};

export default Main;
