import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../../../hocs/FirebaseProvider';
import { apiPostRequest } from '../../../../hocs/axiosRequests';

interface Props {
    open: boolean;
    handleClose: () => void;
    businessId: number;
}

export default function ClaimDialog(props: Props) {
    const { open, handleClose, businessId } = props;
    const [value, setValue] = React.useState<Date | null>(new Date());
    const [error, setError] = React.useState(false);
    const [certificateId, setCertificateId] = React.useState("");
    const { currentUser } = useAuth();

    const handleChange = (newValue: Date | null) => {
        setValue(newValue);
    };

    const handleCertificateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCertificateId(event.target.value);
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (certificateId.length == 0) setError(true);
        else if (value == null) setError(true);
        else {
            const body = JSON.stringify({
                businessId: businessId,
                schedule: value.toISOString(),
                certificateId: certificateId
            })

            await apiPostRequest('/business/new/appointment', body, currentUser?.accessToken);
            handleClose();
        }
    }

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Release Business Permit</DialogTitle>
        <DialogContent>
       
          <DialogContentText>
            Please provide the following information to inform the applicant about the details of claiming their business permit. 
          </DialogContentText>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="Release Date"
                        inputFormat="MM/dd/yyyy"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            <TextField
                autoFocus
                variant="outlined"
                name="businessId"
                label="New Business ID"
                value={certificateId}
                onChange={handleCertificateChange}
                fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
  );
}
