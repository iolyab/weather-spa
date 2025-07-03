import weatherReducer, {
    addCity,
    refreshCity,
    deleteCity,
    openCityNotFoundModal,
    closeCityNotFoundModal,
    CityWeather
  } from './weatherSlice';
  
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
  describe('weatherSlice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      localStorageMock.getItem.mockReturnValue(null);
    });
  
    const initialState = {
      cities: [],
      addCityLoading: false,
      errorModalOpen: false
    };
  
    const mockWeatherData = {
      city: 'London',
      temp: 20,
      icon: '01d',
      description: 'Clear'
    };
  
    describe('reducers', () => {
      it('should handle deleteCity', () => {
        const stateWithCities = {
          ...initialState,
          cities: [
            { ...mockWeatherData, loading: false, error: null },
            { city: 'Paris', temp: 18, icon: '02d', description: 'Cloudy', loading: false, error: null }
          ] as CityWeather[]
        };
  
        const newState = weatherReducer(stateWithCities, deleteCity('London'));
  
        expect(newState.cities).toHaveLength(1);
        expect(newState.cities[0].city).toBe('Paris');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('weatherData', JSON.stringify(newState.cities));
      });
  
      it('should handle openCityNotFoundModal', () => {
        const newState = weatherReducer(initialState, openCityNotFoundModal());
        expect(newState.errorModalOpen).toBe(true);
      });
  
      it('should handle closeCityNotFoundModal', () => {
        const stateWithModalOpen = { ...initialState, errorModalOpen: true };
        const newState = weatherReducer(stateWithModalOpen, closeCityNotFoundModal());
        expect(newState.errorModalOpen).toBe(false);
      });
    });
  
    describe('addCity async thunk', () => {
      it('should handle addCity.pending', () => {
        const action = { type: addCity.pending.type, meta: { arg: 'London' } };
        const newState = weatherReducer(initialState, action);
  
        expect(newState.addCityLoading).toBe(true);
        expect(newState.cities).toHaveLength(1);
        expect(newState.cities[0]).toEqual({
          city: 'London',
          temp: 0,
          icon: '',
          description: '',
          loading: true,
          error: null
        });
      });
  
      it('should handle addCity.fulfilled', () => {
        const stateWithPendingCity = {
          ...initialState,
          addCityLoading: true,
          cities: [{
            city: 'london',
            temp: 0,
            icon: '',
            description: '',
            loading: true,
            error: null
          }] as CityWeather[]
        };
  
        const action = {
          type: addCity.fulfilled.type,
          payload: mockWeatherData
        };
  
        const newState = weatherReducer(stateWithPendingCity, action);
  
        expect(newState.addCityLoading).toBe(false);
        expect(newState.cities[0]).toEqual({
          ...mockWeatherData,
          loading: false,
          error: null
        });
        expect(localStorageMock.setItem).toHaveBeenCalled();
      });
  
      it('should handle addCity.rejected', () => {
        const stateWithPendingCity = {
          ...initialState,
          addCityLoading: true,
          cities: [{
            city: 'InvalidCity',
            temp: 0,
            icon: '',
            description: '',
            loading: true,
            error: null
          }] as CityWeather[]
        };
  
        const action = {
          type: addCity.rejected.type,
          meta: { arg: 'InvalidCity' }
        };
  
        const newState = weatherReducer(stateWithPendingCity, action);
  
        expect(newState.addCityLoading).toBe(false);
        expect(newState.cities).toHaveLength(0);
        expect(newState.errorModalOpen).toBe(true);
      });
    });
  });