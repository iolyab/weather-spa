import React, { useCallback } from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, CircularProgress, Box } from '@mui/material';
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

  const handleCardClick = useCallback(() => {
    navigate(`/city/${city.city}`);
  }, [navigate, city.city]);

  const handleRefresh = useCallback(() => {
    dispatch(refreshCity(city.city));
  }, [dispatch, city.city]);

  const handleDelete = useCallback(() => {
    dispatch(deleteCity(city.city));
  }, [dispatch, city.city]);

  return (
    <Card
      sx={{
        height: '120px',
        px: 2,
        py: 1,
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
      }}
>
  <CardContent
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      p: 0,
      cursor: 'pointer',
      '&:last-child': { pb: 0 },
    }}
    onClick={handleCardClick}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <Box>
        <Typography variant="h6">{city.city}</Typography>
        {!city.loading && !city.error && (
          <Typography variant="body2" color="text.secondary">
            {city.description}
          </Typography>
        )}
      </Box>
      <CardActions sx={{ p: 0 }}>
        <IconButton aria-label="Refresh weather" size="small" onClick={(e) => { e.stopPropagation(); handleRefresh(); }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="Delete card" size="small" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Box>

    {!city.loading && !city.error ? (
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h4">{Math.round(city.temp)}°C</Typography>
        <img
          src={`http://openweathermap.org/img/wn/${city.icon}@2x.png`}
          alt={city.description}
          width={50}
          height={50}
        />
      </Box>
    ) : city.loading ? (
      <CircularProgress size={28} />
    ) : (
      <Typography color="error">{city.error}</Typography>
    )}
  </CardContent>
</Card>

  );
};

export default CityCard;
