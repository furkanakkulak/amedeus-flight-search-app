import React from 'react';
import { useAppContext } from '@/context';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function FlightType() {
  const { state, dispatch } = useAppContext();

  const handleFlightTypeChange = (event) => {
    const newFlightType = event.target.value === 'true';
    dispatch({ type: 'SET_FLIGHT_TYPE', payload: newFlightType });
  };

  return (
    <FormControl>
      <FormLabel
        id="demo-row-radio-buttons-group-label"
        className="font-medium"
      >
        Flight Type
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={state.flightType.toString()}
        onChange={handleFlightTypeChange}
      >
        <FormControlLabel
          value={true}
          control={<Radio />}
          label="One Way"
        />
        <FormControlLabel
          value={false}
          control={<Radio />}
          label="Round Trip"
        />
      </RadioGroup>
    </FormControl>
  );
}
