import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, CircularProgress, Box } from '@mui/material';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const CityDetails: React.FC = () => {
  const { name } = useParams();
  const [data, setData] = useState<{ time: string; temp: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHourly = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&appid=${API_KEY}`
        );

        const hourly = res.data.list.slice(0, 8).map((item: any) => ({
          time: item.dt_txt.split(' ')[1].slice(0, 5),
          temp: item.main.temp,
        }));

        setData(hourly);
      } catch (err) {
        console.error('Error fetching hourly forecast:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHourly();
  }, [name]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Hourly Forecast: {name}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default CityDetails;
