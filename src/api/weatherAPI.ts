import axios from 'axios';

export const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  city: string;
  temp: number;
  icon: string;
  description: string;
}

export const fetchCurrentWeather = async (
  city: string
): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      units: 'metric',
      appid: API_KEY,
    },
  });

  const data = response.data;
  return {
    city: data.name,
    temp: data.main.temp,
    icon: data.weather[0].icon,
    description: data.weather[0].main,
  };
};
