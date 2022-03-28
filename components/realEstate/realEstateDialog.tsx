import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { BusinessRegistry } from '../../pages/dashboard/business/new/assessment/[businessId]';
import { useState } from 'react';
import { apiPostRequest } from '../../hocs/axiosRequests';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Collapse from '@mui/material/Collapse';
import uploadFileToFirebase from '../../hocs/uploadFile';
import FormRadioGroup from '../business/client/FormRadioGroup';
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
    uid: string;
    open: boolean;
    handleClose: () => void;
    accessToken: string;
}

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

type RenewData = {
    ownerName: string;
    taxNumber: string;
    quarterPayment: boolean;
}

export default function FormDialog(props: Props) {
  const { open, handleClose, accessToken, uid } = props;
  const [formData, setFormData] = useState<RenewData>({
    ownerName: '',
    taxNumber: '',
    quarterPayment: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (file) {
        setLoading(true);
        const fileURL = await uploadFileToFirebase(uid, file, file.name);
        const body = JSON.stringify({
            ownerName: formData.ownerName,
            taxNumber: formData.taxNumber,
            receiptFile: fileURL,
            quarterPayment: formData.quarterPayment
        });
        await apiPostRequest('/estate/register', body, accessToken);
          
        setFormData({
            ownerName: '',
            taxNumber: '',
            quarterPayment: false
        });
        setFile(null);
      }

      setLoading(false);

      handleClose();
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        setFile(event.target.files[0]);
    }
  }

  const PaymentTypes = [
    { value: "full", label: "Full Payment" },
    { value: "installment", label: "Installment" }
  ]

  const handlePaymentChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    const installment = value == "installment" ? true : false;
    setFormData({ ...formData, quarterPayment: installment });
    })

  return (
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={submitForm}>
            <DialogTitle>Pay Real Estate Tax</DialogTitle>
            <DialogContent sx={{ maxHeight: 500, overflowY: 'auto' }}>
                <Stack direction="column" spacing={3} sx={{ mb: 3, minWidth: 500 }}>
                    <Typography variant="body1">
                        Please fill out the fields bellow.
                    </Typography>
                    <TextField
                        required
                        autoFocus
                        name="ownerName"
                        label="Real Estate Owner Full Name"
                        placeholder='Last Name, Given Name Middle Initial'
                        fullWidth
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formData.ownerName}
                    />

                    <TextField
                        required
                        name="taxNumber"
                        label={"Tax Declaration Number"}
                        fullWidth
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formData.taxNumber}
                    />

                    <FormRadioGroup 
                        choices={PaymentTypes}
                        value={formData.quarterPayment ? "installment" : "full"}
                        handleValueChange={handlePaymentChange}
                        header="MODE OF PAYMENT"
                    />

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={file ? <DownloadDoneIcon /> : <UploadIcon />}
                        >
                            {file ? "Uploaded" : `Upload ${new Date().getFullYear() - 1} Receipt`}
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg, application/pdf"
                                onChange={handleFileChange}
                                hidden 
                            />
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <LoadingButton type="submit" loading={loading} disabled={Boolean(!file)}>Pay</LoadingButton>
            </DialogActions>
        </form>
      </Dialog>
  );
}
