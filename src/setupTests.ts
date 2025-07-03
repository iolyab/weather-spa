import '@testing-library/jest-dom';

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';

global.IntersectionObserver = class IntersectionObserver {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
  
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
});