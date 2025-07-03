import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import weatherReducer from '../../features/weather/weatherSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: {
      weather: {
        cities: [],
        addCityLoading: false,
        errorModalOpen: false,
      },
    },
  });
};

const renderWithProviders = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </Provider>
  );
};

describe('Home', () => {
  it('should render main components', () => {
    renderWithProviders();

    expect(screen.getByText('Weather App')).toBeInTheDocument();
    expect(screen.getByLabelText('City input')).toBeInTheDocument();
  });
});
