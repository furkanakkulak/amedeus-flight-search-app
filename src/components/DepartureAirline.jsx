import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppContext } from '@/context';

export default function DepartureAirline() {
  const {
    state,
    dispatch,
    handleDepartureAirports,
    handleDepartureAirportSelect,
  } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    handleDepartureAirports();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const options = state?.departureAirports;
    setFilteredOptions(options);
  }, [searchValue, state?.departureAirports]);

  const handleSelect = (option) => {
    handleDepartureAirportSelect(option?.iata_code);
  };

  return (
    <Autocomplete
      id="grouped-demo"
      options={filteredOptions}
      isOptionEqualToValue={(option, value) =>
        option.iata_code === value.iata_code
      }
      groupBy={(option) => (
        <div className="text-[#575757] text-xs flex justify-between items-center ">
          <span className="font-bold">{option.country}</span>
          <span>{option.city}</span>
        </div>
      )}
      getOptionLabel={(option) =>
        `[${option.iata_code}] - ${option.name} (${option.city} - ${option.country})`
      }
      renderOption={(props, option) => (
        <div
          {...props}
          className="text-sm flex items-center px-5 py-2.5 hover:bg-[#e6e6e6] translate duration-200 ease-out"
        >
          [{option.iata_code}] - {option.name}
        </div>
      )}
      sx={{ width: 275 }}
      onInputChange={(event, newValue) => setSearchValue(newValue)}
      onChange={(event, newValue) => handleSelect(newValue)}
      aria-required="true"
      renderInput={(params) => (
        <div>
          <TextField
            {...params}
            label="Departure Airport"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        </div>
      )}
    />
  );
}
