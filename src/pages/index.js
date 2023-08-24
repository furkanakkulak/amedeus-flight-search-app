import React from 'react';
import { CircularProgress, createTheme, ThemeProvider } from '@mui/material';
import ArrivalAirline from '@/components/ArrivalAirline';
import DepartureAirline from '@/components/DepartureAirline';
import Navbar from '@/components/Navbar';
import FlightType from '@/components/FlightType';
import DepartureDate from '@/components/DepartureDate';
import ReturnDate from '@/components/ReturnDate';
import { Button } from '@mui/material';
import { useAppContext } from '@/context';
import {
  CalendarMonth,
  CalendarMonthOutlined,
  FlightLand,
  FlightTakeoff,
  KeyboardArrowRight,
  ScheduleOutlined,
  TimelapseOutlined,
} from '@mui/icons-material';
import { ClockIcon } from '@mui/x-date-pickers';
import FilterButton from '@/components/Filter';

const Index = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#575757',
      },
      secondary: {
        main: '#575757',
      },
      background: {
        default: '#000',
        paper: '#fff',
      },
      text: {
        primary: '#575757',
        secondary: '#000',
      },
    },
  });

  const { state, handleSearchFlight } = useAppContext();

  return (
    <ThemeProvider theme={theme}>
      {state?.isLoading && (
        <div
          className="absolute h-full w-full bg-white bg-opacity-95 flex justify-center items-center flex-col"
          style={{ zIndex: 101 }}
        >
          <CircularProgress size={100} />
          <Button
            variant="outlined"
            className="absolute bottom-52 w-10/12 md:w-auto lowercase"
          >
            We bring for you the flight tickets of the best discovery route
            available to you
          </Button>
        </div>
      )}
      <Navbar />
      <main>
        <div
          className="bg-image"
          style={{ backgroundImage: 'url(main.jpg)' }}
        />

        <div className="search-box">
          <div className="inputs">
            <DepartureAirline />
            <ArrivalAirline />
            <DepartureDate />
            <ReturnDate />
          </div>
          <div className="right">
            <FlightType />
            <Button
              variant="outlined"
              className="hover:text-white h-[56px] w-full"
              onClick={() => handleSearchFlight()}
              disabled={
                state?.departureAirline === '' ||
                state?.departureAirline === null ||
                state?.arrivalAirline === '' ||
                state?.arrivalAirline === null
              }
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                },
              }}
            >
              Search Flight
            </Button>
          </div>
        </div>
      </main>
      {!state?.isLoading && state?.error && (
        <div className="py-10">
          <div className="bg-white shadow-2xl text-[#575757] w-10/12 mx-auto rounded-xl text-3xl font-thin italic tracking-widest py-10 px-5 text-center">
            {state.error}
          </div>
        </div>
      )}
      {!state?.isLoading && state?.submitClicked && state?.oneWay && (
        <section className="flights">
          <div className="title relative">
            <div className="text">One Way Flights</div>
            {state?.submitClicked && state?.oneWay.length < 1 && (
              <p className="absolute bottom-2 left-0 right-0 mx-auto text-center">
                No Data
              </p>
            )}
            <FilterButton way="oneWay" />
          </div>

          {state.oneWay.length > 0 &&
            state.oneWay.map((data, index) => (
              <div
                className="flight"
                key={index}
              >
                <div className="airline-w-price">
                  <div className="airline">{data.airline}</div>
                  <div className="price">
                    {data.price} USD <KeyboardArrowRight />
                  </div>
                </div>
                <div className="flight-info">
                  <div className="departure">
                    <div className="airport">
                      <FlightTakeoff />
                      {data.departureAirport}
                    </div>
                    <div className="date">
                      <CalendarMonthOutlined />
                      {new Date(data.departureDate).toLocaleDateString('en-US')}
                    </div>
                    <div className="time">
                      <ScheduleOutlined />
                      {new Date(data.departureDate).toLocaleTimeString('en-US')}
                    </div>
                  </div>
                  <div className="duration">
                    <TimelapseOutlined />
                    <div className="time">
                      {`${Math.floor(data.duration / 60)}h ${
                        data.duration % 60
                      }m`}
                    </div>
                  </div>
                  <div className="arrival">
                    <div className="airport">
                      {data.arrivalAirport} <FlightLand />
                    </div>
                    <div className="date">
                      {new Date(data.arrivalDate).toLocaleDateString('en-US')}
                      <CalendarMonthOutlined />
                    </div>
                    <div className="time">
                      {new Date(data.arrivalDate).toLocaleTimeString('en-US')}
                      <ScheduleOutlined />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}
      {!state?.isLoading &&
        state?.submitClicked &&
        !state.flightType &&
        state?.returnWay && (
          <section className="flights">
            <div className="title relative">
              <div className="text">Return Way Flights</div>
              {!state?.flightType && state?.returnWay.length < 1 && (
                <p className="absolute bottom-2 left-0 right-0 mx-auto text-center">
                  No Data
                </p>
              )}
              <FilterButton way="returnWay" />
            </div>

            {state.returnWay.length > 0 &&
              state.returnWay.map((data, index) => (
                <div
                  className="flight"
                  key={index}
                >
                  <div className="airline-w-price">
                    <div className="airline">{data.airline}</div>
                    <div className="price">
                      {data.price} USD <KeyboardArrowRight />
                    </div>
                  </div>
                  <div className="flight-info">
                    <div className="departure">
                      <div className="airport">
                        <FlightTakeoff />
                        {data.departureAirport}
                      </div>
                      <div className="date">
                        <CalendarMonthOutlined />
                        {new Date(data.departureDate).toLocaleDateString(
                          'en-US'
                        )}
                      </div>
                      <div className="time">
                        <ScheduleOutlined />
                        {new Date(data.departureDate).toLocaleTimeString(
                          'tr-TR'
                        )}
                      </div>
                    </div>
                    <div className="duration">
                      <TimelapseOutlined />
                      <div className="time">
                        {`${Math.floor(data.duration / 60)}h ${
                          data.duration % 60
                        }m`}
                      </div>
                    </div>
                    <div className="arrival">
                      <div className="airport">
                        {data.arrivalAirport} <FlightLand />
                      </div>
                      <div className="date">
                        {new Date(data.arrivalDate).toLocaleDateString('en-US')}
                        <CalendarMonthOutlined />
                      </div>
                      <div className="time">
                        {new Date(data.arrivalDate).toLocaleTimeString('tr-TR')}
                        <ScheduleOutlined />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </section>
        )}
    </ThemeProvider>
  );
};

export default Index;
