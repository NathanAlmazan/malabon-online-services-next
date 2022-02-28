import React from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { apiGetRequest, apiPostRequest } from '../../../../hocs/axiosRequests';
import { useAuth } from '../../../../hocs/FirebaseProvider';

interface Props {
    open: boolean;
    handleClose: () => void;
    fileURL: string;
    paymentId: number;
}

export default function PaymentVerifyDialog(props: Props) {
  const {  open, handleClose, fileURL, paymentId } = props;
  const [expand, setExpand] = React.useState<boolean>(false);
  const [remarks, setRemarks] = React.useState<string>("");
  const [error, setError] = React.useState(false);
  const { currentUser } = useAuth();

  const handleViewSubmittedFile = (pathFile: string | undefined) => {
    if (pathFile) window.open(pathFile, "_blank");
  } 

  const handleApprove = async () => {
    await apiGetRequest('/payments/business/bank/confirm/' + paymentId, currentUser?.accessToken);
    handleClose();
  }

  const handleReject = () => {
    setExpand(!expand)
  }

  const handleremarksChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRemarks(event.target.value);
  }

  const handleSubmitReject = async () => {
    if (remarks.length == 0) setError(true);
    else {
      const body = JSON.stringify({
        paymentId: paymentId,
        rejectMessage: remarks
      })

      await apiPostRequest('/payments/reject', body, currentUser?.accessToken);
      handleClose();
    }
  }

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Verify Payment</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            The file below contains the image or scanned proof of transaction.
          </DialogContentText>
          <Image 
            src={fileURL}
            alt="prrof of transaction"
            width={500}
            height={300}
            onClick={() => handleViewSubmittedFile(fileURL)}
          />
        </DialogContent>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          <Box sx={{
            display: 'flex',
            p: 3
          }}>
            <TextField 
              fullWidth
              name="report"
              label="Remarks"
              multiline
              rows={2}
              value={remarks}
              onChange={handleremarksChange}
              error={error}
              helperText={error ? "Remarks is required" : null}
            />
          </Box>
        </Collapse>
        <DialogActions>
          {expand ? (
            <>
              <Button onClick={handleReject}>Cancel</Button>
              <Button onClick={handleSubmitReject}>Submit</Button>
            </>
          ) : (
            <>
              <Button onClick={handleReject}>Reject</Button>
              <Button onClick={handleApprove}>Approve</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
  );
}
