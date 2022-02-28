import React from 'react';
import Stack from "@mui/material/Stack";
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FileDownloadDoneOutlinedIcon from '@mui/icons-material/FileDownloadDoneOutlined';
import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';

interface Props {
    uploadFile: (file: File) => void;
    uploaded: boolean;
    loading: boolean;
    submitBankDeposit: (event: React.MouseEvent<HTMLButtonElement>) => void;

}

function BankDepositForm({ uploadFile, uploaded, loading, submitBankDeposit }: Props) {

    const handleAddOtherFiles = (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {
        uploadFile(acceptedFiles[0]);
    }); 

  return (
   <Stack spacing={2} sx={{ mt: 4 }}>
       <Paper 
            variant="outlined"
            sx={{
            width: '100%',
            height: 180, 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: 'red', 
            mb: 2
       }}>
            <Dropzone
                onDrop={handleAddOtherFiles}
                accept={["image/*"]}
                minSize={1024}
                maxSize={3072000}
            >
                {({ getRootProps, getInputProps }) => (
                    <Stack justifyContent="center" alignItems="center" spacing={1} {...getRootProps()}>
                        <input {...getInputProps()} />

                        {uploaded ? (
                            <FileDownloadDoneOutlinedIcon color="primary" sx={{ width: 30, height: 30 }} />
                        ) : (
                            <CameraAltRoundedIcon color="primary" sx={{ width: 30, height: 30 }} />
                        )}

                        <Typography variant="body1" align="center" sx={{ fontStyle: "italic", maxWidth: 320 }}>
                            {uploaded ? "Uploaded successfully!" : "Upload proof of your transaction. Please make sure that the reference number is visible."}
                        </Typography>
                    </Stack>
                )}
            </Dropzone>
           
       </Paper>
       <LoadingButton variant="contained" size="large" loading={loading} onClick={submitBankDeposit}>
           Submit Payment
       </LoadingButton>
   </Stack>
  )
}

export default BankDepositForm