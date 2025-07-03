import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CityCard from './CityCard';
import weatherReducer, {
  CityWeather,
} from '../../features/weather/weatherSlice';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

const renderWithProviders = (city: CityWeather) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <CityCard city={city} />
      </BrowserRouter>
    </Provider>
  );
};

describe('CityCard', () => {
  const mockCity: CityWeather = {
    city: 'London',
    temp: 20.5,
    icon: '01d',
    description: 'Clear',
    loading: false,
    error: null,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render city information correctly', () => {
    renderWithProviders(mockCity);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('21°C')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Clear' })).toHaveAttribute(
      'src',
      'http://openweathermap.org/img/wn/01d@2x.png'
    );
  });

  it('should navigate to city details when card is clicked', () => {
    renderWithProviders(mockCity);

    fireEvent.click(screen.getByText('London'));
    expect(mockNavigate).toHaveBeenCalledWith('/city/London');
  });

  it('should display loading state', () => {
    const loadingCity = { ...mockCity, loading: true };
    renderWithProviders(loadingCity);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('21°C')).not.toBeInTheDocument();
  });

  it('should display error state', () => {
    const errorCity = { ...mockCity, loading: false, error: 'Failed to load' };
    renderWithProviders(errorCity);

    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(screen.queryByText('21°C')).not.toBeInTheDocument();
  });

  it('should handle refresh button click', () => {
    renderWithProviders(mockCity);

    const refreshButton = screen.getByLabelText('Refresh weather');
    fireEvent.click(refreshButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle delete button click', () => {
    renderWithProviders(mockCity);

    const deleteButton = screen.getByLabelText('Delete card');
    fireEvent.click(deleteButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
