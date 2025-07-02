import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherState {
  cities: string[];
}

const savedCities = localStorage.getItem('cities');

const initialState: WeatherState = {
  cities: savedCities ? JSON.parse(savedCities) : [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<string>) {
      const city = action.payload.trim();
      if (!state.cities.includes(city)) {
        state.cities.push(city);
        localStorage.setItem('cities', JSON.stringify(state.cities));
      }
    },
    deleteCity(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter(c => c !== action.payload);
      localStorage.setItem('cities', JSON.stringify(state.cities));
    },
  },
});

export const { addCity, deleteCity } = weatherSlice.actions;
export default weatherSlice.reducer;

