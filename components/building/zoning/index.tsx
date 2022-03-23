import React, { useCallback, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useLoadScript } from '@react-google-maps/api';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ZoningToolbar = dynamic(() => import('./ZoningToolbar'));
const ZoningMap = dynamic(() => import('./ZoningMap'));

interface Props {
    mapsKey: string;
    accessToken: string;
    onSubmit: (location: Location) => void;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface BusinessTypes {
    typeId: number;
    typeName: string;
    zoneId: number;
    approved?: boolean;
}

type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization"

const libraries: libray[] = ['places'];

function ZoningPage({ mapsKey, accessToken, onSubmit }: Props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [addressError, setAddressError] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<Location>({
        lat: 14.657868,
        lng: 120.950761,
        address: 'Malabon City Hall, F. Sevilla Boulevard, Malabon, Kalakhang Maynila'
    })
    const { isLoaded, loadError  } = useLoadScript({
        googleMapsApiKey: mapsKey,
        libraries
    })

    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map: google.maps.Map) => {
      mapRef.current = map;
    }, []);

    const handleLocationChange = (location: Location) => {
        if (location.address.split(', ').length < 4) {
            setAddressError("Please atleast specify the street of your business address.");
        } 
        else setAddressError(state => null);

        setCurrentLocation(location);
    }

    const panTo = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
        if (mapRef.current != undefined) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(18);
        }
    }, []);

    const handleSubmitAddress = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (currentLocation.address != 'Malabon City Hall, F. Sevilla Boulevard, Malabon, Kalakhang Maynila') {
            onSubmit(currentLocation);
        } else setAddressError("Building location is required.");
    }

  return (
    <>
        <Typography 
            component="div" 
            variant={matches ? 'h6' : 'h5'} 
            color="primary" align="center" 
            sx={{ 
                minHeight: 80, 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center' ,
                justifyContent: 'center'
            }}>
            <strong>Building Location</strong>
        </Typography>

        {isLoaded && (
            <ZoningToolbar 
                panTo={panTo} 
                setLocation={(location) => handleLocationChange(location)}
                error={addressError}
            />
        )}

        <Box sx={{ width: '100%', height: { xs: 400, md: 500 }, mt: 3, mb: 4 }}>
            <ZoningMap 
                isLoaded={isLoaded}
                loadError={loadError}
                location={currentLocation}
                onMapLoad={onMapLoad}
            />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 4, mb: 2 }}>
            <Button 
                variant="contained" 
                size="large" 
                endIcon={<ArrowForwardIcon />}
                onClick={handleSubmitAddress}
                
            >
                Next Step
            </Button>
        </Box>
    </>
  );
}

export default ZoningPage;
