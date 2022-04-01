import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';

interface Location {
    lat: number;
    lng: number;
    address: string;
}

interface Props {
    isLoaded: boolean;
    loadError: Error | undefined;
    location: Location;
    onMapLoad: (map: google.maps.Map) => void;
    setLocation: (lat: number, lng: number) => void;
}

const mapStyle = {
    width: '100%',
    height: '100%'
}

const centerLocation = {
    lat: 14.657868,
    lng: 120.950761
}

const options = {
    disableDefaultUI: true,
    zoomControl: true,
}

function ZoningMap({ isLoaded, loadError, location, onMapLoad, setLocation }: Props) {

    const handleMapClick = ((event: google.maps.MapMouseEvent) => {
       if (event.latLng) {
        setLocation(event.latLng.lat(), event.latLng.lng());
       }
    })

    if (!isLoaded) return <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}><CircularProgress /></Box>;
    if (loadError) return <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}><ErrorIcon fontSize='large' /></Box>;

  return (
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={18}
        center={centerLocation}
        onClick={handleMapClick}
        options={options}
        onLoad={onMapLoad}
      >
          <Marker position={{ lat: location.lat, lng: location.lng }} />
      </GoogleMap>
  );
}

export default ZoningMap;
