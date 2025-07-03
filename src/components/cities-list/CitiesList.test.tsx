import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CitiesList from './CitiesList';
import weatherReducer, {
  CityWeather,
} from '../../features/weather/weatherSlice';

const createMockStore = (cities: CityWeather[]) => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: {
      weather: {
        cities,
        addCityLoading: false,
        errorModalOpen: false,
      },
    },
  });
};

const renderWithProviders = (cities: CityWeather[]) => {
  const store = createMockStore(cities);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CitiesList />
      </BrowserRouter>
    </Provider>
  );
};

describe('CitiesList', () => {
  it('should render empty list when no cities', () => {
    renderWithProviders([]);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render cities list', () => {
    const mockCities: CityWeather[] = [
      {
        city: 'London',
        temp: 20,
        icon: '01d',
        description: 'Clear',
        loading: false,
        error: null,
      },
      {
        city: 'Paris',
        temp: 18,
        icon: '02d',
        description: 'Cloudy',
        loading: false,
        error: null,
      },
    ];
    renderWithProviders(mockCities);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('18°C')).toBeInTheDocument();
  });
});
