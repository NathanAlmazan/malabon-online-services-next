import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import { BuildingRequirements } from "../buildingTypes";

const FileUploadBox = styled(Box)({
    height: 100,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
});

interface Props {
    engineer: string;
    handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addFormFiles: (file: File, documentType: string) => void;
    removeFile: (fileName: string) => void;
    editable: boolean;
    formFiles: BuildingRequirements;
}

function RequirementsForm(props: Props) {
    const { engineer, addFormFiles, editable, formFiles, handleTextChange, removeFile } = props;
    const { blueprint, engineerLicense, otherFiles } = formFiles;

    const handleLicenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], "License");
        }
    }

    const handleBlueprintChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFormFiles(event.target.files[0], "Blueprint");
        }
    }

    const handleViewSubmittedFile = (pathFile: string | undefined) => {
        if (pathFile) window.open(pathFile, "_blank");
    }

    const handleAddOtherFiles = (<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach(file => {
            addFormFiles(file, "Other Requirements");
        })
    }); 

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
                        <TextField 
                            fullWidth
                            required
                            name="engineer"
                            label="Engineer/Architect Name"
                            value={engineer ? engineer : ''}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                   {editable ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={engineerLicense ? <DownloadDoneIcon /> : <UploadIcon />}
                                >
                                    {engineerLicense ? "Uploaded" : "Upload License"}
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        onChange={handleLicenseChange}
                                        hidden 
                                    />
                            </Button>
                        </Grid>
                   ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                onClick={() => handleViewSubmittedFile(engineerLicense?.fileURL)}
                                startIcon={<DownloadDoneIcon />}
                                >
                                    {"View License"}
                            </Button>
                        </Grid>
                   )}
                    <Grid item xs={12} md={12}>
                        <Divider color="red" />
                    </Grid>
                   <Grid item xs={12} md={7}>
                        <FormLabel>Please upload your building blueprint</FormLabel>
                    </Grid>
                    {editable ? (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={blueprint ? <DownloadDoneIcon /> : <UploadIcon />}
                                >
                                    {blueprint ? "Uploaded" : "Upload Blueprint"}
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                                        onChange={handleBlueprintChange}
                                        hidden 
                                    />
                            </Button>
                        </Grid>
                   ) : (
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                onClick={() => handleViewSubmittedFile(blueprint?.fileURL)}
                                startIcon={<DownloadDoneIcon />}
                                >
                                    {"View Blueprint"}
                            </Button>
                        </Grid>
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

export default RequirementsForm