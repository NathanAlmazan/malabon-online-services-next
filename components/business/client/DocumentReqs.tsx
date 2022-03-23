import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Dropzone, { FileRejection, DropEvent } from 'react-dropzone';
import { styled } from '@mui/styles';
import { BusinessFiles, FormData, FormFiles } from "./businessTypes";

const FileUploadBox = styled(Box)({
    height: 100,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
});

type DocumentTypes = "Proof of Registration" | "Tax Incentive Certificate" | "Contract of Lease" | "Tax Declaration" | "Other Requirements" | "Zone Appeal";

interface Props {
    formData: FormData;
    handleCheckChange: (name: string, checked: boolean) => void;
    addFormFiles: (file: File, documentType: DocumentTypes) => void;
    removeFile: (fileName: string) => void;
    editable: boolean;
    formFiles: BusinessFiles;
    approved: boolean;
}

function DocumentReqs(props: Props) {
    const { formData, handleCheckChange, editable, formFiles, addFormFiles, removeFile, approved } = props;
    const { taxIncentive, rented } = formData;
    const { otherFiles, registrationFile, rentedFile, taxIncentiveFile, zoneAppeal } = formFiles;

    const handleTaxIncentiveChange = ((event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        handleCheckChange("taxIncentive", checked);
    }); 

    const handleRentedChange = ((event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        handleCheckChange("rented", checked);
    }); 

    const handleTaxFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], "Tax Incentive Certificate");
        }
    }

    const handleRentedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], rented ? "Contract of Lease" : "Tax Declaration");
        }
    }

    const handleRegistrationFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], "Proof of Registration");
        }
    }

    const handleZoneFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], "Zone Appeal");
        }
    }

    const handleAddOtherFiles = (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach(file => {
            addFormFiles(file, "Other Requirements");
        })
    }); 

    const handleViewSubmittedFile = (pathFile: string | undefined) => {
        if (pathFile) window.open(pathFile, "_blank");
    }

  return (
    <Paper variant="outlined" sx={{ borderColor: "red", mb: 4 }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    DOCUMENTARY REQUIREMENTS
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3} alignItems="start">
                    <Grid item xs={12} md={7}>
                        <FormControlLabel 
                            control={<Checkbox />} 
                            label="Do you have tax incentives from any Government Entity?"
                            checked={taxIncentive}
                            onChange={editable ? handleTaxIncentiveChange : undefined}
                        />
                    </Grid>
                    {editable ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                component="label"
                                disabled={!taxIncentive}
                                startIcon={taxIncentiveFile ? <DownloadDoneIcon /> : <UploadIcon />}
                                >
                                    {taxIncentiveFile ? "Uploaded" : "Upload Certificate"}
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        onChange={handleTaxFileChange}
                                        hidden 
                                    />
                            </Button>
                        </Grid>
                    ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                disabled={!taxIncentive}
                                onClick={() => handleViewSubmittedFile(taxIncentiveFile?.fileURL)}
                                startIcon={<DownloadDoneIcon />}
                            >
                                View Certificate
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={12} md={12}>
                        <Divider color="red" />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <FormControlLabel 
                            control={<Checkbox />} 
                            label="Do you pay rent for occupying a place of business?"
                            checked={rented}
                            onChange={editable ? handleRentedChange : undefined}
                        />
                    </Grid>
                   {editable ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={rentedFile ? <DownloadDoneIcon /> : <UploadIcon />}
                                >
                                    {rentedFile ? "Uploaded" : rented ? "Upload Contract of Lease" : "Upload Tax Declaration"}
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        onChange={handleRentedFileChange}
                                        hidden 
                                    />
                            </Button>
                        </Grid>
                   ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                onClick={() => handleViewSubmittedFile(rentedFile?.fileURL)}
                                startIcon={<DownloadDoneIcon />}
                                >
                                    {rented ? "View Contract of Lease" : "View Tax Declaration"}
                            </Button>
                        </Grid>
                   )}
                    <Grid item xs={12} md={12}>
                        <Divider color="red" />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <FormLabel>Please upload your proof of registration (DTI / SEC / CTI)</FormLabel>
                    </Grid>
                    {editable ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={registrationFile ? <DownloadDoneIcon /> : <UploadIcon />}
                                >
                                    {registrationFile ? "Uploaded" : "Upload Proof of Registration"}
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        onChange={handleRegistrationFileChange}
                                        hidden 
                                    />
                            </Button>
                        </Grid>
                    ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                onClick={() => handleViewSubmittedFile(registrationFile?.fileURL)}
                                startIcon={<DownloadDoneIcon />}
                                >
                                    View Proof of Registration
                            </Button>
                        </Grid>
                    )}
                    {!approved && (
                        <>
                        <Grid item xs={12} md={12}>
                            <Divider color="red" />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <FormLabel>Please upload your zone appeal</FormLabel>
                        </Grid>
                        {editable ? (
                            <Grid item xs={12} md={5}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={zoneAppeal ? <DownloadDoneIcon /> : <UploadIcon />}
                                    >
                                        {zoneAppeal ? "Uploaded" : "Upload Your Zone Appeal"}
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            onChange={handleZoneFileChange}
                                            hidden 
                                        />
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12} md={5}>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleViewSubmittedFile(zoneAppeal?.fileURL)}
                                    startIcon={<DownloadDoneIcon />}
                                    >
                                        View Zone Appeal
                                </Button>
                            </Grid>
                        )}
                        </>
                    )}
                    <Grid item xs={12} md={12}>
                        <Divider color="red" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box sx={{ border: '1px solid red', p: 2 }}>
                            <Grid container spacing={3}>
                                {otherFiles.map(file => (
                                    <Grid item key={file.fileName} xs={12} md={6}>
                                        <Paper elevation={10} sx={{ p: 2 }} onClick={() => handleViewSubmittedFile(file.fileURL)}>
                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" noWrap>
                                                    {file.fileName}
                                                </Typography>
                                                <Tooltip title="Remove">
                                                    <IconButton onClick={() => removeFile(file.fileName)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                            {editable && (
                                <Dropzone
                                    onDrop={handleAddOtherFiles}
                                    accept={["image/*", "application/pdf"]}
                                    minSize={1024}
                                    maxSize={3072000}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                    <FileUploadBox {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {otherFiles.length == 0 && (
                                            <Typography variant="body2" noWrap>
                                                Drop other requirements here.
                                            </Typography>
                                        )}
                                    </FileUploadBox>
                                    )}
                                </Dropzone>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default DocumentReqs