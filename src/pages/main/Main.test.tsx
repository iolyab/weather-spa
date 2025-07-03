import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Main from './Main';
import weatherReducer from '../../features/weather/weatherSlice';

const createMockStore = (addCityLoading = false, errorModalOpen = false) => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: {
      weather: {
        cities: [],
        addCityLoading,
        errorModalOpen,
      },
    },
  });
};

const renderWithProviders = (
  addCityLoading = false,
  errorModalOpen = false
) => {
  const store = createMockStore(addCityLoading, errorModalOpen);
  return render(
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

describe('Main', () => {
  it('should render form elements', () => {
    renderWithProviders();

    expect(screen.getByLabelText('City input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('should update input value when typing', () => {
    renderWithProviders();

    const input = screen.getByLabelText('City input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'London' } });

    expect(input.value).toBe('London');
  });

  it('should show loading state on button when adding city', () => {
    renderWithProviders(true);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('should prevent form submission with short city name', () => {
    renderWithProviders();

    const input = screen.getByLabelText('City input');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(input, { target: { value: 'L' } });
    fireEvent.click(addButton);
  });

  it('should show error modal when errorModalOpen is true', () => {
    renderWithProviders(false, true);

    expect(screen.getByText('City Not Found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The city you entered could not be found. Please try again.'
      )
    ).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    renderWithProviders(false, true);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
  });
});
