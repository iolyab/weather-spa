import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentWeather, WeatherData } from '../../api/weatherAPI';

export interface CityWeather extends WeatherData {
    loading: boolean;
    error: string | null;
  }

interface WeatherState {
  cities: CityWeather[];
  errorModalOpen: boolean;
}

const saved = localStorage.getItem('weatherData');

const initialState: WeatherState = {
  cities: saved ? JSON.parse(saved) : [],
  errorModalOpen: false,
};


export const addCity = createAsyncThunk<
  WeatherData,
  string,
  {state: {weather: WeatherState}}>(
    'weather/addCity',
        async (city: string, { rejectWithValue }) => {
        try {
            return await fetchCurrentWeather(city);
        } catch (err) {
            return rejectWithValue('City not found');
        }
    },
    {condition: (city, { getState }) => {
      const { cities } = getState().weather;
      const alreadyExists = cities.some(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
      return !alreadyExists;
    },}
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
    openCityNotFoundModal(state) {
      state.errorModalOpen = true;
    },
    closeCityNotFoundModal(state) {
      state.errorModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCity.pending, (state, action) => {
        state.cities.unshift({
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
        state.cities = state.cities.filter(c => c.city !== action.meta.arg);
        state.errorModalOpen = true;
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

export const {deleteCity, openCityNotFoundModal, closeCityNotFoundModal} = weatherSlice.actions;
export default weatherSlice.reducer;

