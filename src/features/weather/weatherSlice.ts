import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentWeather, WeatherData } from '../../api/weatherAPI';

export interface CityWeather extends WeatherData {
    loading: boolean;
    error: string | null;
  }

interface WeatherState {
  cities: CityWeather[];
}

const saved = localStorage.getItem('weatherData');

const defaultCities = ['London', 'New York', 'Kyiv'];

const initialState: WeatherState = {
  cities: saved ? JSON.parse(saved) : defaultCities.map((city) => ({
    city,
    temp: 20,
    icon: '01d',
    description: 'Clear',
    loading: false,
    error: null,
  }))
};

export const addCity = createAsyncThunk(
    'weather/addCity',
        async (city: string, { rejectWithValue }) => {
        try {
            return await fetchCurrentWeather(city);
        } catch (err) {
            return rejectWithValue('City not found');
        }
    }
);

export const refreshCity = createAsyncThunk(
    'weather/refreshCity',
        async (city: string, { rejectWithValue }) => {
        try {
            return await fetchCurrentWeather(city);
        } catch (err) {
            return rejectWithValue('Failed to refresh');
        }
    }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    deleteCity(state, action: PayloadAction<string>) {
      state.cities = state.cities.filter(c => c.city !== action.payload);
      localStorage.setItem('weatherData', JSON.stringify(state.cities));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCity.pending, (state, action) => {
        state.cities.push({
          city: action.meta.arg,
          temp: 0,
          icon: '',
          description: '',
          loading: true,
          error: null,
        });
      })
      .addCase(addCity.fulfilled, (state, action) => {
        const index = state.cities.findIndex(c => c.city === action.payload.city);
        if (index !== -1) {
          state.cities[index] = { ...action.payload, loading: false, error: null };
        }
        localStorage.setItem('weatherData', JSON.stringify(state.cities));
      })
      .addCase(addCity.rejected, (state, action) => {
        const city = action.meta.arg;
        const index = state.cities.findIndex(c => c.city === city);
        if (index !== -1) {
          state.cities[index].loading = false;
          state.cities[index].error = action.payload as string;
        }
      })

      .addCase(refreshCity.fulfilled, (state, action) => {
        const index = state.cities.findIndex(c => c.city === action.payload.city);
        if (index !== -1) {
          state.cities[index] = { ...action.payload, loading: false, error: null };
          localStorage.setItem('weatherData', JSON.stringify(state.cities));
        }
      });
    }
});

export const {deleteCity } = weatherSlice.actions;
export default weatherSlice.reducer;

