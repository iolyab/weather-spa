import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import classes from './cityDetails.module.scss';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const CityDetails: React.FC = () => {
  const { name } = useParams();
  const [hourlyData, setHourlyData] = useState<
    { time: string; temp: number }[]
  >([]);
  const [dailyData, setDailyData] = useState<{ day: string; temp: number }[]>(
    []
  );
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const geoRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}`
        );

        const { lat, lon } = geoRes.data.coord;

        const oneCallRes = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`
        );

        const { hourly, daily } = oneCallRes.data;

        setHourlyData(
          hourly.slice(0.8).map((h: any) => ({
            time: new Date(h.dt * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            temp: h.temp,
          }))
        );

        setDailyData(
          daily.slice(0, 7).map((d: any) => {
            const date = new Date(d.dt * 1000);
            const today = new Date();

            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            return {
              day: isToday
                ? 'Today'
                : date.toLocaleDateString([], { weekday: 'short' }),
              temp: d.temp.day,
            };
          })
        );

        const airRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const airQualityIndex = airRes.data.list[0].main.aqi;
        setAqi(airQualityIndex);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [name]);

  const getAqiDescription = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'Good';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Poor';
      case 5:
        return 'Very Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" align="center" gutterBottom>
        Weather Details: {name}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Hourly Chart */}
          <Typography variant="h6" gutterBottom>
            ⛅ Weather Today
          </Typography>
          <div className={classes.chartContainer}>
            <ResponsiveContainer width="95%" height={220}>
              <LineChart data={hourlyData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#1976d2"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7-Day Forecast */}
          <Typography variant="h6" gutterBottom>
            📅 7-Day Forecast
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {dailyData.map((day, idx) => (
              <Card
                key={idx}
                sx={{
                  display: 'inline-block',
                  p: 1,
                  minWidth: { xs: 50, sm: 90, md: 140 },
                  maxWidth: { xs: 50, sm: 900, md: 140 },
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                  backdropFilter: 'blur(6px)',
                  flexShrink: 0,
                  cursor: 'default',
                }}
              >
                <Typography align="center">{day.day}</Typography>
                <Typography align="center" variant="h6">
                  {Math.round(day.temp)}°C
                </Typography>
              </Card>
            ))}
          </Stack>

          {/*AQI*/}
          <Card>
            <CardContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              <Typography variant="h6">💨 Air Quality Index</Typography>
              <Typography>
                AQI: {aqi} – {aqi ? getAqiDescription(aqi) : 'Loading...'}
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CityDetails;
