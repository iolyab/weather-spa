// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from '../src/app/store';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Routing Integration', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';
  });

  it('renders Home page on "/" route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/weather app/i)).toBeInTheDocument(); // Actual app content
  });

  it('renders CityDetails on "/city/London"', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { coord: { lat: 51.5, lon: -0.1 } },
      })
      .mockResolvedValueOnce({
        data: {
          hourly: [],
          daily: [],
        },
      })
      .mockResolvedValueOnce({
        data: {
          list: [{ main: { aqi: 2 } }],
        },
      });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/city/London']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByText(/weather details: london/i)
    ).toBeInTheDocument();
  });
});
