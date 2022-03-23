import React, { useEffect, useState } from 'react';
import { Box, TextField, Autocomplete, InputAdornment } from '@mui/material';
import usePlacesAutocomplete, { getLatLng, getGeocode, getZipCode } from 'use-places-autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { Location } from './index';

interface Props {
  panTo: ({ lat, lng }: {
    lat: number;
    lng: number;
  }) => void;
  setLocation: (location: Location) => void;
  error: string | null;
}

export default function ZoningToolbar({ panTo, setLocation, error }: Props) {
  const [filteredData, setFilteredData] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
  } = usePlacesAutocomplete({
      requestOptions: {
          location: {
              lat: () => 14.657868,
              lng: () => 120.950761,
              equals: () => true,
              toJSON: () => ({ lat: 14.657868, lng: 120.950761 }),
              toUrlValue: () => 'address' 
          },
          radius: 100 * 1000
      }
  });

  useEffect(() => {
    if (status == "OK") {
      const filteredAddress = data.filter(address => address.description.includes("Malabon"));
      setFilteredData(state => filteredAddress);
    } else  setFilteredData(state => []);
  }, [data, status])

  const handleSelect = async (address: string | null) => {
    if (address != null) {
      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        const zipCode = await getZipCode(results[0], true);

        const finalAddress = zipCode != null ? address + ', ' + zipCode : address;
        panTo({ lat, lng });
        setLocation({ lat, lng, address: finalAddress });
      } catch (error) {
        console.log("😱 Error: ", error);
      }
      }
  };

  return (
    <div>
        <Box sx={{ width: { xs: '100%', sm: 500, md: 600 } }}>
          <Autocomplete
            freeSolo
            value={value}
            onChange={(event: any, newValue: string | null) => {
              handleSelect(newValue);
            }}
            inputValue={value}
            onInputChange={(event, newInputValue) => {
              setValue(newInputValue);
            }}
            loading={!ready}
            options={status === "OK" ? filteredData.map(res => res.description) : []}
            renderInput={(params) => 
              <TextField {...params} 
                fullWidth placeholder="House No. Street, Barangay..." 
                variant="outlined" 
                error={error != null}
                helperText={error != null ? error : null}
              />
            }
          />
      </Box>
    </div>
  );
}
