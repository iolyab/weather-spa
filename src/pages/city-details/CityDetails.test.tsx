import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import CityDetails from './CityDetails';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ name: 'London' })
}));

const mockWeatherResponse = {
  data: {
    coord: { lat: 51.5074, lon: -0.1278 }
  }
};

const mockOneCallResponse = {
  data: {
    hourly: Array.from({ length: 24 }, (_, i) => ({
      dt: Date.now() / 1000 + i * 3600,
      temp: 20 + Math.random() * 5
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
      dt: Date.now() / 1000 + i * 86400,
      temp: { day: 20 + Math.random() * 5 }
    }))
  }
};

const mockAirPollutionResponse = {
  data: {
    list: [{ main: { aqi: 2 } }]
  }
};

describe('CityDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';
  });

  it('should render loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); 

    render(
      <BrowserRouter>
        <CityDetails />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render weather data after loading', async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockWeatherResponse)
      .mockResolvedValueOnce(mockOneCallResponse)
      .mockResolvedValueOnce(mockAirPollutionResponse);

    render(
      <BrowserRouter>
        <CityDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Weather Details: London')).toBeInTheDocument();
    });

    expect(screen.getByText('⛅ Weather Today')).toBeInTheDocument();
    expect(screen.getByText('📅 7-Day Forecast')).toBeInTheDocument();
    expect(screen.getByText('💨 Air Quality Index')).toBeInTheDocument();
    expect(screen.getByText('AQI: 2 – Fair')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <CityDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

 
    expect(screen.getByText('Weather Details: London')).toBeInTheDocument();
  });
});