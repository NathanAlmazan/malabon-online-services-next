import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { useLoadScript } from '@react-google-maps/api';
import { Button, Chip, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Geocode from "react-geocode";
import { constantCase } from 'change-case';
import { apiPostRequest } from '../../../../hocs/axiosRequests';

const ZoningToolbar = dynamic(() => import('./ZoningToolbar'));
const ZoningBusiness = dynamic(() => import('./ZoningBusiness'));
const ZoningMap = dynamic(() => import('./ZoningMap'));
const ZoningAlert = dynamic(() => import('./ZoningAlert'));

const ParallaxBox = styled(Box)({
    backgroundImage: 'url("/covers/malabon_statue.png")',
    minHeight: 400,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25
  });

interface Props {
    mapsKey: string;
    accessToken: string;
    onSubmit: (location: Location, business: BusinessTypes, exist: boolean) => void;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

type ZoningResult = {
    zone: {
        zoneBase: string;
        zoneCode: string;
    },
    overlay: {
        overlayBase: string;
        overlayCode: string;
    },
    businessTypes: BusinessTypes[]
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
    const [collapse, setCollapse] = useState<boolean>(false);
    const [businessZone, setBusinessZone] = useState<string | null>('');
    const [clickedLocation, setClickedLocation] = useState<string | null>(null);

    const [currentLocation, setCurrentLocation] = useState<Location>({
        lat: 14.657868,
        lng: 120.950761,
        address: 'Malabon City Hall, F. Sevilla Boulevard, Malabon, Kalakhang Maynila'
    })
    const [addressError, setAddressError] = useState<string | null>(null);
    const [businessError, setBusinessError] = useState<boolean>(false);
    const { isLoaded, loadError  } = useLoadScript({
        googleMapsApiKey: mapsKey,
        libraries
    })

    const [businessTypes, setBusinessTypes] = useState<BusinessTypes[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessTypes | null>(null);
    const [openAlert, setOpenAlert] = useState<boolean>(false);

    const handleSelectBusiness = (businessType: BusinessTypes) => {
        setBusinessError(false);
        setSelectedBusiness(businessType);
    }

    useEffect(() => {
        const getBusinessTypes = async () => {
            const finalLocation = currentLocation.address.split(', ');

            const body = JSON.stringify({
                street: finalLocation[0],
                barangay: finalLocation[1]
            })
            
            const result = await apiPostRequest('/business/new/zone/get', body, accessToken);

            if (result.status < 300) {
                const businessTypes: BusinessTypes[] = (result.data as ZoningResult).businessTypes;

                console.log(result.data)

                setBusinessZone(state => (result.data as ZoningResult).zone ? (result.data as ZoningResult).zone.zoneBase : null);
                setCollapse(state => true);

                let finalTypes: BusinessTypes[] = [];

                businessTypes.forEach(type => {
                    const typeIndex = finalTypes.findIndex(t => t.typeName === type.typeName);
                    if (typeIndex === -1) finalTypes.push(type);
                    else {
                        finalTypes[typeIndex].approved = Boolean(type.approved || finalTypes[typeIndex].approved);
                    }
                })

                setBusinessTypes(state => finalTypes);
            } else {
                setCollapse(state => false);
            }
        }

        if (currentLocation.address != 'Malabon City Hall, F. Sevilla Boulevard, Malabon, Kalakhang Maynila' && !addressError) {
            getBusinessTypes();
        }
    }, [currentLocation, accessToken, addressError])

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
        if (selectedBusiness != null) {
            if (selectedBusiness.approved && businessZone != null) {
                onSubmit(currentLocation, selectedBusiness, Boolean(businessZone != null));
            } else {
                setOpenAlert(true);
            }
        } else setBusinessError(true);
    }

    const handleAlert = () => {
        if (selectedBusiness != null) {
            setOpenAlert(false);
            onSubmit(currentLocation, selectedBusiness, Boolean(businessZone != null));
        }
    }

    const handleMapClick = async (lat: number, lng: number) => {
        Geocode.setApiKey("AIzaSyBampCnnbMpDkGIkQmZRGjU8YFARfo13Ns");
        Geocode.setLanguage("en");
        Geocode.fromLatLng(lat.toString(), lng.toString()).then(
            (response) => {
                const result = response.results[0].formatted_address;
                setCurrentLocation(state => ({ lat: lat, lng: lng, address: result }));
                setClickedLocation(result);
            },
                (error) => {
                    console.error(error);
                }
            );
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
            <strong>Business Zoning</strong>
        </Typography>

        {isLoaded && (
            <ZoningToolbar 
                panTo={panTo} 
                setLocation={(location) => handleLocationChange(location)}
                error={addressError}
                clickedLocation={clickedLocation}
            />
        )}

        <Box sx={{ width: '100%', height: { xs: 400, md: 500 }, mt: 3, mb: 4 }}>
            <ZoningMap 
                isLoaded={isLoaded}
                loadError={loadError}
                location={currentLocation}
                onMapLoad={onMapLoad}
                setLocation={handleMapClick}
            />
        </Box>

        <Collapse in={collapse} timeout="auto" unmountOnExit>
            <>
                <Divider sx={{ mb: 4, mt: 5 }}>
                    <Chip label="Business Types" />
                </Divider>

                <ParallaxBox>
                    <Image src="/icons/malabon_logo.png" alt='malabon_logo' width={120} height={120} />
                    {businessZone ? (
                        <Typography component="h1" variant="body1" sx={{ maxWidth: { xs: 250, md: 400 }, mt: 4, fontSize: { xs: 14, md: 18 } }} color="white" align="center">
                            Your business location is within the allowed use for <strong>{constantCase(businessZone)}</strong>, 
                            pursuant to Ordinance No. 538, Series of 2019. Please select your business type from the allowed businesses below for this zone.
                        </Typography>
                    ) : (
                        <Typography component="h1" variant="body1" sx={{ maxWidth: { xs: 250, md: 400 }, mt: 4, fontSize: { xs: 14, md: 18 } }} color="white" align="center">
                            Your business location is not yet in the current database.
                            Please select your business type from the businesses below for this zone.
                        </Typography>
                    )}
                </ParallaxBox>
        
                <ZoningBusiness 
                    businessTypes={businessTypes}
                    selectedBusiness={selectedBusiness}
                    error={businessError}
                    onSelect={handleSelectBusiness}
                />

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
        </Collapse>
        <ZoningAlert 
            open={openAlert}
            handleClose={() => setOpenAlert(false)}
            handleSubmit={handleAlert}
        />
    </>
  );
}

export default ZoningPage;
