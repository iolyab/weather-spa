import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { deleteCity } from '../features/weather/weatherSlice';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CityList: React.FC = () => {
  const cities = useAppSelector(state => state.weather.cities);
  const dispatch = useAppDispatch();

  return (
    <List>
      {cities.map((city) => (
        <ListItem
          key={city}
          secondaryAction={
            <IconButton edge="end" onClick={() => dispatch(deleteCity(city))}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={city} />
        </ListItem>
      ))}
    </List>
  );
};

export default CityList;
