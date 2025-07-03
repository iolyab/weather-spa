import { Route, Routes } from 'react-router-dom';
import CityDetails from './pages/CityDetails';
import Home from './pages/Home';


const App: React.FC = () => {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/city/:name" element={<CityDetails />} />
      </Routes>
  );
};

export default App;
