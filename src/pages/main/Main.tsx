import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  addCity,
  closeCityNotFoundModal,
} from '../../features/weather/weatherSlice';
import {
  selectAddCityLoading,
  selectErrorModalOpen,
} from '../../features/selectors';
import classes from './main.module.scss';

const Main: React.FC = () => {
  const [city, setCity] = useState('');
  const dispatch = useAppDispatch();
  const cityNotFoundModalOpen = useAppSelector(selectErrorModalOpen);
  const loading = useAppSelector(selectAddCityLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cityName = city.trim();
    if (cityName.length < 2) return;

    const resultAction = await dispatch(addCity(cityName));

    if (!addCity.rejected.match(resultAction)) {
      setCity('');
    } else {
      setCity('');
    }
  };

  const handleCloseModal = useCallback(() => {
    dispatch(closeCityNotFoundModal());
  }, [dispatch]);

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <TextField
          aria-label="City input"
          label="Find the city..."
          variant="outlined"
          size="small"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
          sx={{ '& .MuiInputBase-input': { p: '12px' } }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ minWidth: 80, position: 'relative' }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Add'
          )}
        </Button>
      </form>

      <Modal
        open={cityNotFoundModalOpen}
        onClose={handleCloseModal}
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
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Main;
