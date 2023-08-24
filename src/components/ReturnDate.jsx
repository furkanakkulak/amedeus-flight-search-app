import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useAppContext } from '@/context';

export default function ReturnDate() {
  const { state, dispatch } = useAppContext();
  const tomorrow = dayjs().tz('America/New_York').add(1, 'day');

  const handleDateChange = (date) => {
    dispatch({ type: 'SET_RETURN_DATE', payload: date });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker
          className="w-full"
          label="Return Date"
          minDate={tomorrow}
          onChange={handleDateChange}
          disabled={state.flightType}
          value={state?.returnDate}
        />
      </div>
    </LocalizationProvider>
  );
}
