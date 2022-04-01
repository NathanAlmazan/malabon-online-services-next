import React, { useState, useEffect, useRef, useCallback } from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Head from "next/head";
import { useLoadScript } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { useAuth } from '../../hocs/FirebaseProvider';
import { apiGetRequest, apiPostRequest } from '../../hocs/axiosRequests';
import ZoningMap from "../../components/zoning/ZoningMap";
import Divider from "@mui/material/Divider";
import LoadingButton from '@mui/lab/LoadingButton';
import Copyright from "../../components/Copyright";

type ZoneClassification = {
    zoneId: number;
    zoneCode: string;
    zoneBase: string;
}

type Location = {
    lat: number;
    lng: number;
    address: string;
}

type ZoneInformation = {
    street: string;
    barangay: string | null;
    zone: ZoneClassification | null;
}

type BusinessType = {
    type: string;
    zone: ZoneClassification | null;
}

type Result = {
    open: boolean;
    error: string | null;
}

type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization"

const libraries: libray[] = ['places'];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function ZonePage() {
  const { currentUser } = useAuth();
  const { isLoaded, loadError  } = useLoadScript({
    googleMapsApiKey: "AIzaSyBampCnnbMpDkGIkQmZRGjU8YFARfo13Ns",
    libraries
  });
  const [zoneTypes, setZoneTypes] = useState<ZoneClassification[]>([]);
  const [location, setLocaation] = useState<Location>({
    lat: 14.657868,
    lng: 120.950761,
    address: ""
  });
  const [zoneInfo, setZoneInfo] = useState<ZoneInformation>({
      street: '',
      barangay: null,
      zone: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<Result>({
      open: false,
      error: null,
  });
  const [businessType, setBusinessType] = useState<BusinessType>({
      type: '',
      zone: null
  })

  const mapRef = useRef<google.maps.Map>();
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const setLocation = (lat: number, lng: number) => {
    setLocaation({ ...location, lat: lat, lng: lng });
  }

  useEffect(() => {
    Geocode.setApiKey("AIzaSyBampCnnbMpDkGIkQmZRGjU8YFARfo13Ns");
    Geocode.setLanguage("en");
    Geocode.fromLatLng(location.lat.toString(), location.lng.toString()).then(
    (response) => {
        const result = response.results[0].formatted_address;
        setZoneInfo(state => ({ ...state, street: result.split(", ")[0], barangay: barangays.includes(result.split(", ")[1]) ? result.split(", ")[1] : null }));
    },
        (error) => {
            console.error(error);
        }
    );

  }, [location]);

  useEffect(() => {
    const getZoneTypes = async () => {
        const result = await apiGetRequest('/business/new/zone/classes', currentUser?.accessToken);
        const types = result.data as ZoneClassification[];

        setZoneTypes(state => types);
    }

    if (currentUser) {
        getZoneTypes();
    }
  }, [currentUser])

  const handleBarangayChange = ((event: React.SyntheticEvent<Element, Event>, value: string | null) => {
      if (value) {
        setZoneInfo({ ...zoneInfo, barangay: value });
      }
  })

  const handleZoneTypeChange = ((event: React.SyntheticEvent<Element, Event>, value: ZoneClassification | null) => {
    if (value) {
        setZoneInfo({ ...zoneInfo, zone: value });
    }
})

const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoneInfo({ ...zoneInfo, street: event.target.value });
}

const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen({ open: false, error: null });
  };

const handleSaveClassification = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (zoneInfo.zone && zoneInfo.street && zoneInfo.barangay) {
        setLoading(true);
        const body = JSON.stringify({
            zoneId: zoneInfo.zone.zoneId,
            street: zoneInfo.street,
            barangay: zoneInfo.barangay
        })
        const result = await apiPostRequest('/business/new/zone/boundary', body, currentUser?.accessToken);
        if (result.status > 300) {
            setOpen({ open: true, error: result.message });
            setLoading(false);
        } else {
            setOpen({ open: true, error: null });
            setZoneInfo({
                street: '',
                barangay: null,
                zone: null
            });
            setLoading(false);
        }
    } else {
        setOpen({ open: true, error: "Street, Barangay and Zone is required." });
    }
}

const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessType({ ...businessType, type: event.target.value });
}

const handleTypeChange = ((event: React.SyntheticEvent<Element, Event>, value: ZoneClassification | null) => {
    if (value) {
        setBusinessType({ ...businessType, zone: value });
    }
})

const handleSaveBusiness = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (businessType.type.length > 0 && businessType.zone) {
        setLoading(true);
        const body = JSON.stringify({
            zoneId: businessType.zone.zoneId,
            type: businessType.type
        })
        const result = await apiPostRequest('/business/new/zone/business', body, currentUser?.accessToken);
        if (result.status > 300) {
            setOpen({ open: true, error: result.message });
            setLoading(false);
        } else {
            setOpen({ open: true, error: null });
            setBusinessType({
                type: '',
                zone: null,
            })
            setLoading(false);
        }
    } else {
        setOpen({ open: true, error: "Business Type and Zone Type is required." });
    }
}

  return (
    <>
        <Head>
            <title>
            Manage Zoning | Municipal Online Services
            </title>
        </Head>
        <Container>
            <Box sx={{ mt: 5 }}>
                <Typography component="h1" fontWeight="bold" color="primary" variant="h5" textAlign="left">
                    Manage Zoning
                </Typography>
            </Box>
            <Paper elevation={10} sx={{ mt: 5, p: 4 }}>
                <Grid container spacing={2} justifyContent="flex-end" sx={{ mb: 5 }}>
                    <Grid item xs={12} md={12}>
                        <Typography component="h1" fontWeight="bold" color="primary" variant="h6" textAlign="center">
                            Add Business Type
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField 
                            variant="outlined"
                            name="business"
                            label="Business Type"
                            value={businessType.type}
                            onChange={handleChangeType}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            disablePortal
                            options={zoneTypes}
                            value={businessType.zone}
                            onChange={handleTypeChange}
                            getOptionLabel={(option: ZoneClassification) => option.zoneBase}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Zone Type" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <LoadingButton 
                            variant="contained"
                            fullWidth
                            loading={loading}
                            onClick={handleSaveBusiness}
                        >
                            Save Business
                        </LoadingButton>
                    </Grid>
                </Grid>
                <Divider sx={{ borderColor: 'red' }} />
                <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item xs={12} md={12}>
                        <Typography component="h1" fontWeight="bold" color="primary" variant="h6" textAlign="center">
                            Add Zone Boundary
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField 
                            variant="outlined"
                            name="street"
                            label="Street"
                            onChange={handleStreetChange}
                            value={zoneInfo.street}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            disablePortal
                            options={barangays}
                            onChange={handleBarangayChange}
                            value={zoneInfo.barangay}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Barangay" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            disablePortal
                            options={zoneTypes}
                            onChange={handleZoneTypeChange}
                            value={zoneInfo.zone}
                            getOptionLabel={(option: ZoneClassification) => option.zoneBase}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Zone Type" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ width: '100%', height: { xs: 400, md: 500 }, mt: 3, mb: 4 }}>
                            <ZoningMap 
                                isLoaded={isLoaded}
                                loadError={loadError}
                                location={location}
                                onMapLoad={onMapLoad}
                                setLocation={setLocation}
                            />
                       </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <LoadingButton 
                            variant="contained"
                            fullWidth
                            loading={loading}
                            onClick={handleSaveClassification}
                        >
                            Save Zone
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Paper>
            <Copyright />
        </Container>
        <Snackbar open={open.open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={open.error ? "error" : "success"} sx={{ width: '100%' }}>
                {open.error ? open.error : "Saved Successfully!"}
            </Alert>
        </Snackbar>
    </>
  )
}

export default ZonePage;


const barangays = ["Acacia", "Baritan", "Bayan-Bayanan", "Catmon", "Concepcion", "Dampalit", "Flores", "Hulong Duhat", 
  "Ibaba", "Longos", "Maysilo", "Muzon", "Niugan", "Panghulo", "Potrero", "San Agustin", "Santolan", "Tañong", "Tinajeros",
  "Tonsuya", "Tugatog"];
