import { RootState } from '../app/store';

export const selectErrorModalOpen = (state: RootState) =>
  state.weather.errorModalOpen;

export const selectAddCityLoading = (state: RootState) =>
  state.weather.addCityLoading;

export const selectCities = (state: RootState) => state.weather.cities;
