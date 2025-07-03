import axios from 'axios';
import { fetchCurrentWeather } from './weatherAPI';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('weatherAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';
  });

  describe('fetchCurrentWeather', () => {
    it('should fetch weather data successfully', async () => {
      const mockResponse = {
        data: {
          name: 'London',
          main: {
            temp: 20.5,
          },
          weather: [
            {
              icon: '01d',
              main: 'Clear',
            },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchCurrentWeather('London');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: 'London',
            units: 'metric',
            appid: 'test-api-key',
          },
        }
      );

      expect(result).toEqual({
        city: 'London',
        temp: 20.5,
        icon: '01d',
        description: 'Clear',
      });
    });

    it('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(fetchCurrentWeather('InvalidCity')).rejects.toThrow(
        'API Error'
      );
    });
  });
});
