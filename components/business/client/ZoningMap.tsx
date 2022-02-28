import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
    isLoaded: boolean;
    loadError: Error | undefined;
    location: { lat?: string, lng?: string };
    onMapLoad: (map: google.maps.Map) => void;
    viewOnly: boolean;
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

function ZoningMap({ isLoaded, loadError, location, onMapLoad, viewOnly }: Props) {
    const [currLocation, setLocation] = useState({
        lat: 14.657868,
        lng: 120.950761
    })

    useEffect(() => {
        if (location.lat != undefined && location.lng != undefined) {
            setLocation({ lat: parseFloat(location.lat), lng: parseFloat(location.lng) })
        }
    }, [location])

    if (!isLoaded) return <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}><CircularProgress /></Box>;
    if (loadError) return <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}><ErrorIcon fontSize='large' /></Box>;

  return (
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={18}
        center={viewOnly ? currLocation : centerLocation}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker 
            position={{ 
                lat: currLocation.lat, 
                lng: currLocation.lng
            }} 
        />
      </GoogleMap>
  );
}

export default ZoningMap;
