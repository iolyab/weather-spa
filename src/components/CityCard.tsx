import React from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { CityWeather, deleteCity, refreshCity } from '../features/weather/weatherSlice';
import { useAppDispatch } from '../hooks';
import { useNavigate } from 'react-router-dom';

interface Props {
  city: CityWeather;
}

const CityCard: React.FC<Props> = ({ city }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/city/${city.city}`);
  };

  const handleRefresh = () => {
    dispatch(refreshCity(city.city));
  };

  const handleDelete = () => {
    dispatch(deleteCity(city.city));
  };

  return (
    <Card sx={{ mb: 2 }} >
      <CardContent sx={{cursor: 'pointer'}} onClick={handleCardClick}>
        <Typography variant="h6">{city.city}</Typography>
        {city.loading ? (
          <CircularProgress size={24} />
        ) : city.error ? (
          <Typography color="error">{city.error}</Typography>
        ) : (
          <>
            <Typography variant="h4">{Math.round(city.temp)}°C</Typography>
            <Typography>{city.description}</Typography>
            <img
              src={`http://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt={city.description}
              width={50}
              height={50}
            />
          </>
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default CityCard;
