import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city) return alert('Please enter a city');
    try {
      const res = await axios.get(`http://localhost:5000/weather?city=${city}`);
      setWeather(res.data);
    } catch {
      alert('Could not fetch weather');
    }
  };

  const chartData = {
    labels: weather?.forecast.map(day => day.date) || [],
    datasets: [
      {
        label: 'Temp (°C)',
        data: weather?.forecast.map(day => day.temp) || [],
        borderColor: 'rgb(176, 41, 183)',
        backgroundColor: 'rgba(215, 15, 169, 0.4)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text:`5-Day Forecast for ${weather?.city || ''}` },
    },
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && (
        <>
          <div className="weather-info">
            <p>Current temp in {weather.city}: {weather.current.temp} °C</p>
            <p>Condition: {weather.current.condition}</p>
          </div>

          <div className="chart-container" style={{ marginTop: '30px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;