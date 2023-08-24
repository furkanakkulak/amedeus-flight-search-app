import React from 'react';
import { useAppContext } from '@/context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function DepartureDate() {
  const { state, dispatch } = useAppContext();
  const today = dayjs().tz('America/New_York');

  const handleDateChange = (date) => {
    dispatch({ type: 'SET_DEPARTURE_DATE', payload: date });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker
          className="w-full"
          label="Departure Date"
          minDate={today}
          onChange={handleDateChange}
          value={state?.departureDate}
        />
      </div>
    </LocalizationProvider>
  );
}
