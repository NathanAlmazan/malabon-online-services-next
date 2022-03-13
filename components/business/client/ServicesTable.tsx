import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { capitalCase } from 'change-case';
import { BusinessServices, BusinessTypes } from './businessTypes';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import BusinessDialogs from './BusinessDialogs';

interface Props {
    services: BusinessServices[];
    addSerrvice: (service: BusinessServices) => void;
    removeService: (value: BusinessServices) => void;
    editable: boolean;
    lineOfBusiness: BusinessTypes[];
    zoningType?: string;
    zoningId?: number;
}

type BusinessDetails = {
  productService: string;
  psicCode: string;
}
function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function ServicesTable(props: Props) {
  const { services, editable, lineOfBusiness, zoningType, zoningId, addSerrvice, removeService } = props;
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessTypes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    productService: '',
    psicCode: ''
  });

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessDetails({ ...businessDetails, [event.target.name]: event.target.value });
  }

  useEffect(() => {
    if (zoningType && zoningId) {
      setSelectedBusiness(state => ({
        typeName: zoningType,
        typeId: zoningId,
        zoneId: 1
      }));
    }
    
  }, [zoningType, zoningId])
  
  const handleSelectBusiness = (business: BusinessTypes) => {
    setSelectedBusiness(business);
    setError(null);
  }

  const handleCancel = () => {
    setOpen(false);
    setSelectedBusiness(null);
  }

  const handleReset = () => {
    setBusinessDetails({
      productService: '',
      psicCode: ''
    });
    setSelectedBusiness(null);
  }

  const handleAddLineOfBusiness = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedBusiness != null && businessDetails.productService.length > 0) {
      addSerrvice({
        businessType: { typeName: selectedBusiness.typeName },
        businessTypeId: selectedBusiness.typeId,
        productService: businessDetails.productService,
        psicCode: businessDetails.psicCode
      })
      handleReset();
      forceUpdate();
    } else setError("Line of business and product or services is required");
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Line of Business</TableCell>
            <TableCell align="right">Product/Services</TableCell>
            <TableCell align="right">PSIC Code</TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
            {services.map(service => (
                <TableRow
                    key={service.businessTypeId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {service.businessType.typeName}
                    </TableCell>
                    <TableCell align="right">{capitalCase(service.productService)}</TableCell>
                    <TableCell align="right" sx={{ fontStyle: "italic" }}>{service.psicCode ? service.psicCode : "Unspecified"}</TableCell>
                    <TableCell align="right">
                        {editable && (
                            <Stack direction="row">
                                <IconButton onClick={() => removeService(service)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </TableCell>
                </TableRow>
            ))}
            <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: theme.palette.secondary.light }}
                >
                    <TableCell component="th" scope="row">
                      <TextField 
                        name="businessType"
                        fullWidth
                        placeholder='Line of Business'
                        value={selectedBusiness ? selectedBusiness.typeName : ''}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">
                            <IconButton color="primary" onClick={() => setOpen(true)}>
                              <AddBusinessIcon />
                            </IconButton>
                          </InputAdornment>
                        }}
                        error={Boolean(error != null)}
                        helperText={error}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField 
                        name="productService"
                        fullWidth
                        value={businessDetails.productService}
                        placeholder='Product / Service'
                        onChange={handleTextChange}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontStyle: "italic" }}>
                      <TextField 
                        name="psicCode"
                        fullWidth
                        value={businessDetails.psicCode}
                        placeholder='For BPLO/CTO only'
                        onChange={handleTextChange}
                      />
                    </TableCell>
                    <TableCell align="right">
                        {editable && (
                            <Stack direction="row">
                                <IconButton color="primary" onClick={handleAddLineOfBusiness}>
                                    <AddIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </TableCell>
                </TableRow>
        </TableBody>
      </Table>
      <BusinessDialogs 
          open={open}
          businessTypes={lineOfBusiness}
          handleClose={() => setOpen(!open)}
          selectedBusiness={selectedBusiness}
          onSelect={handleSelectBusiness}
          handleCancel={handleCancel}
          error={false}
      />
    </TableContainer>
  )
}

export default ServicesTable