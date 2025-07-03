import { Route, Routes } from 'react-router-dom';
import CityDetails from './pages/city-details/CityDetails';
import Home from './pages/home/Home';


const App: React.FC = () => {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:name" element={<CityDetails />} />
      </Routes>
  );
};

export default App;
