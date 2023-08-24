import axios from 'axios';
import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  flightType: true,
  departureAirline: null,
  arrivalAirline: null,
  departureDate: null,
  returnDate: null,
  departureAirports: [],
  arrivalAirports: [],
  oneWay: [],
  returnWay: [],
  isLoading: false,
  submitClicked: false,
  error: null,
};

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FLIGHT_TYPE':
      return { ...state, flightType: action.payload, returnDate: null };
    case 'SET_DEPARTURE_AIRLINE':
      return {
        ...state,
        departureAirline: action.payload,
        arrivalAirline: null,
        arrivalAirports: [],
        oneWay: [],
        returnWay: [],
        submitClicked: false,
      };
    case 'SET_ARRIVAL_AIRLINE':
      return { ...state, arrivalAirline: action.payload };
    case 'SET_DEPARTURE_DATE':
      return { ...state, departureDate: action.payload };
    case 'SET_RETURN_DATE':
      return { ...state, returnDate: action.payload };
    case 'SET_ONE_WAY':
      return { ...state, oneWay: action.payload };
    case 'SET_RETURN_WAY':
      return { ...state, returnWay: action.payload };
    case 'SET_ARRIVAL_AIRPORTS':
      return { ...state, arrivalAirports: action.payload };
    case 'SET_DEPARTURE_AIRPORTS':
      return { ...state, departureAirports: action.payload };
    case 'SUBMIT_BUTTON_CLICKED':
      return { ...state, submitClicked: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleDepartureAirports = async () => {
    await axios
      .get('/api/getDepartureAirports')
      .then((response) => {
        dispatch({ type: 'SET_DEPARTURE_AIRPORTS', payload: response.data });
      })
      .catch((error) => {
        console.error('Error fetching departure airports:', error);
      });
  };

  const handleDepartureAirportSelect = async (selectedAirport) => {
    dispatch({ type: 'SET_DEPARTURE_AIRLINE', payload: selectedAirport });
    await axios
      .get(`/api/getArrivalAirports?departureAirport=${selectedAirport}`)
      .then((response) => {
        dispatch({ type: 'SET_ARRIVAL_AIRPORTS', payload: response.data });
      })
      .catch((error) => {
        console.error('Error fetching arrival airports:', error);
      });
  };

  const handleSearchFlight = async () => {
    dispatch({ type: 'SET_ONE_WAY', payload: null });
    dispatch({ type: 'SET_RETURN_WAY', payload: null });
    const departureAirport = state.departureAirline;
    const arrivalAirport = state.arrivalAirline;
    const departureDateQueryParam = state.departureDate
      ? `&departureDate=${state?.departureDate?.$d.toISOString()}`
      : '';
    const returnDateQueryParam =
      !state.oneWay || state.returnDate
        ? `&returnDate=${state?.returnDate?.$d.toISOString()}`
        : '';
    const flightType = state.flightType;
    const apiUrl = `/api/getFlight?departureAirport=${departureAirport}&arrivalAirport=${arrivalAirport}${departureDateQueryParam}${returnDateQueryParam}&oneway=${flightType}`;

    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    await axios
      .get(apiUrl)
      .then((response) => {
        dispatch({ type: 'SET_ONE_WAY', payload: response.data.oneway });
        dispatch({ type: 'SET_RETURN_WAY', payload: response.data.returnWay });
        dispatch({
          type: 'SUBMIT_BUTTON_CLICKED',
          payload: true,
        });
        setTimeout(() => {
          dispatch({ type: 'SET_LOADING', payload: false });
        }, 1500);
      })
      .catch((error) => {
        dispatch({ type: 'SET_ERROR', payload: error.response.data.message });
        dispatch({ type: 'SET_LOADING', payload: false });

        console.error('Error fetching arrival airports:', error);
      });
  };

  const timeToMinutes = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return hours * 60 + minutes;
  };

  const sortFlights = (type, value, stateVal) => {
    if (state.oneWay.length === 0 && stateVal === 'oneWay') {
      return;
    }
    if (state.returnWay.length === 0 && stateVal === 'returnWay') {
      return;
    }

    const sortedDepartureFlights =
      stateVal === 'oneWay' ? [...state.oneWay] : [...state.returnWay]; // State'e göre hangi yol tipinin sıralanacağını belirliyoruz
    const sortedReturnFlights =
      stateVal === 'oneWay' ? [...state.returnWay] : [...state.oneWay]; // State'e göre hangi yol tipinin sıralanacağını belirliyoruz

    const sortFunction = (a, b) => (type === 'asc' ? a - b : b - a);

    switch (value) {
      case 'price':
        sortedDepartureFlights.sort((a, b) => sortFunction(a.price, b.price));
        sortedReturnFlights.sort((a, b) => sortFunction(a.price, b.price));
        break;
      case 'departure_time':
        sortedDepartureFlights.sort((a, b) =>
          sortFunction(
            timeToMinutes(a.departureDate), // Departure tarihini düzgün şekilde seçin
            timeToMinutes(b.departureDate)
          )
        );
        sortedReturnFlights.sort((a, b) =>
          sortFunction(
            timeToMinutes(a.departureDate), // Departure tarihini düzgün şekilde seçin
            timeToMinutes(b.departureDate)
          )
        );
        break;
      case 'arrival_time':
        sortedDepartureFlights.sort((a, b) =>
          sortFunction(
            timeToMinutes(a.arrivalDate), // Arrival tarihini düzgün şekilde seçin
            timeToMinutes(b.arrivalDate)
          )
        );
        sortedReturnFlights.sort((a, b) =>
          sortFunction(
            timeToMinutes(a.arrivalDate), // Arrival tarihini düzgün şekilde seçin
            timeToMinutes(b.arrivalDate)
          )
        );
        break;
      case 'duration':
        sortedDepartureFlights.sort((a, b) =>
          sortFunction(a.duration, b.duration)
        );
        sortedReturnFlights.sort((a, b) =>
          sortFunction(a.duration, b.duration)
        );
        break;
      default:
        break;
    }

    stateVal === 'oneWay'
      ? dispatch({ type: 'SET_ONE_WAY', payload: sortedDepartureFlights })
      : dispatch({ type: 'SET_RETURN_WAY', payload: sortedDepartureFlights });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        handleDepartureAirports,
        handleDepartureAirportSelect,
        handleSearchFlight,
        sortFlights,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
