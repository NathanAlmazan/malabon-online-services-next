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
import { BusinessRegistry } from '../../../../pages/dashboard/business/new/assessment/[businessId]';
import { useState } from 'react';
import { apiPostRequest } from '../../../../hocs/axiosRequests';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Collapse from '@mui/material/Collapse';
import uploadFileToFirebase from '../../../../hocs/uploadFile';
import FormRadioGroup from '../FormRadioGroup';
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
    uid: string;
    open: boolean;
    handleClose: () => void;
    businesses: BusinessRegistry[];
    accessToken: string;
}

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

type RenewData = {
    permitNumber: string;
    receiptNumber: string;
    businessName: string;
    quarterPayment: boolean;
}

export default function FormDialog(props: Props) {
  const { open, handleClose, businesses, accessToken, uid } = props;
  const [selected, setSelected] = useState<number | null>(null);
  const [formData, setFormData] = useState<RenewData>({
    permitNumber: '',
    receiptNumber: '',
    businessName: '',
    quarterPayment: false
  });
  const [expand, setExpand] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (file) {
        setLoading(true);
        const fileURL = await uploadFileToFirebase(uid, file, file.name);
        if (selected == null) {
            const body = JSON.stringify({
                permitNumber: formData.permitNumber,
                receiptNumber: formData.receiptNumber,
                receiptFile: fileURL,
                businessName: formData.businessName,
                quarterPayment: formData.quarterPayment
            });
            await apiPostRequest('/business/renew/byCredentials', body, accessToken);
          } else {
            const body = JSON.stringify({
                businessId: selected,
                receiptNumber: formData.receiptNumber,
                receiptFile: fileURL,
                quarterPayment: formData.quarterPayment
            });
            await apiPostRequest('/business/renew/byId', body, accessToken);
          }
          
            setSelected(null);
            setFormData({
                permitNumber: '',
                receiptNumber: '',
                businessName: '',
                quarterPayment: false
            });
            setFile(null);
            setExpand(false);
      }

      setLoading(false);

      handleClose();
  }

  const handleSelect = (businessId: number, certificate: string | null, businessName: string) => {
    setSelected(businessId);
    setFormData({ ...formData, permitNumber: certificate ? certificate : '',  businessName: businessName });
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
            <DialogTitle>Renew Business</DialogTitle>
            <DialogContent sx={{ maxHeight: 500, overflowY: 'auto' }}>
                <Stack direction="column" spacing={3} sx={{ mb: 3, minWidth: 500 }}>
                    <Typography variant="body1">
                        Please fill out the fields bellow.
                    </Typography>
                    <TextField
                        required={Boolean(selected == null)}
                        autoFocus
                        name="permitNumber"
                        label="Mayor's Permit Number"
                        fullWidth
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formData.permitNumber}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <IconButton color="primary" onClick={() => setExpand(!expand)}>
                                <AddBusinessIcon />
                              </IconButton>
                            </InputAdornment>
                          }}
                    />

                    <TextField
                        required
                        name="receiptNumber"
                        label={"Official Receipt Number " + new Date().getFullYear()}
                        fullWidth
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formData.receiptNumber}
                    />

                    <Collapse in={expand} timeout="auto" unmountOnExit>
                        <Stack direction="column" spacing={3} sx={{ minWidth: 500 }}>
                            <Typography variant="body1">
                            Select the name of your business.
                            </Typography>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                {businesses.map(businessList => (
                                    <ListItem key={businessList.businessId} sx={Boolean(selected == businessList.businessId) ? { bgcolor: 'primary.light', color: 'white' }: undefined}>
                                        <ListItemButton onClick={() => handleSelect(businessList.businessId, businessList.certificateId, businessList.businessName)}>
                                            <ListItemIcon>
                                                <Avatar>
                                                    {getInitials(businessList.businessName)}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={businessList.businessName} 
                                                secondary={new Date(businessList.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} 
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Stack>
                    </Collapse>
                    
                    <TextField
                        required
                        name="businessName"
                        label="Business Name"
                        fullWidth
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formData.businessName}
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
            <LoadingButton type="submit" loading={loading} disabled={Boolean(!file)}>Renew</LoadingButton>
            </DialogActions>
        </form>
      </Dialog>
  );
}
