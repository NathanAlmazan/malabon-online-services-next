import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Snackbar from '@mui/material/Snackbar';
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import parseCookies from '../../../config/parseCookie';
import uploadFileToFirebase from '../../../hocs/uploadFile';
import { BuildingOwner, Location, BuildingAddress, BuildingInformation, BuildingRequirements, FormFiles, RegistrationData, SubmittedForm } from '../../../components/building/buildingTypes';
import { apiGetRequest, apiPostRequest } from '../../../hocs/axiosRequests';

const ApplicationOwner = dynamic(() => import("../../../components/building/form/applicantInformation"));
const BuildingAddress = dynamic(() => import("../../../components/building/form/BuildingAddress"));
const DocumentRequirements = dynamic(() => import("../../../components/building/form/documentRequirements"));
const BuildingInfo = dynamic(() => import("../../../components/building/form/buildingInfo"));
const FormRadioGroup = dynamic(() => import("../../../components/business/client/FormRadioGroup"));
const StepProgress = dynamic(() => import("../../../components/StepProgress"));
const Copyright = dynamic(() => import("../../../components/Copyright"));

const ScopeOfWork = [
    { value: "NEW CONSTRUCTION", label: "NEW CONSTRUCTION" },
    { value: "ERECTION", label: "ERECTION" },
    { value: "ADDITION", label: "ADDITION" },
    { value: "ALTERATION", label: "ALTERATION" },
    { value: "RENOVATION", label: "RENOVATION" },
    { value: "CONVERSION", label: "CONVERSION" },
    { value: "REPAIR", label: "REPAIR" },
    { value: "MOVING", label: "MOVING" },
    { value: "RAISING", label: "RAISING" },
    { value: "ACCESSORY BUILDING/STRUCTURE", label: "ACCESSORY BUILDING/STRUCTURE" }
];

const BuildingUse = [
    { value: "RESIDENTIAL DWELLINGS", label: "RESIDENTIAL DWELLINGS" },
    { value: "RESIDENTIAL HOTEL/APARTMENT", label: "RESIDENTIAL HOTEL/APARTMENT" },
    { value: "EDUCATIONAL", label: "EDUCATIONAL" },
    { value: "INSTITUTIONAL", label: "INSTITUTIONAL" },
    { value: "BUSINESS AND MERCANTILE", label: "BUSINESS AND MERCANTILE" },
    { value: "INDUSTRIAL", label: "INDUSTRIAL" },
    { value: "INDUSTRIAL STORAGE AND HAZARDOUS", label: "INDUSTRIAL STORAGE AND HAZARDOUS" },
    { value: "RECREATIONAL ASSEMBLY A", label: "RECREATIONAL ASSEMBLY (LOAD LESS THAN 1000)" },
    { value: "RECREATIONAL ASSEMBLY B", label: "RECREATIONAL ASSEMBLY (LOAD 1000 OR MORE)" },
    { value: "AGRICULTURAL", label: "AGRICULTURAL" }
];

const PaymentTypes = [
    { value: "full", label: "Full Payment" },
    { value: "installment", label: "Installment" }
]

type UserAccount = {
    account: {
        email: string;
        userId: number;
        uid: string;
    }
}

interface Props {
    location: { 
        location: Location;
    };
    account: UserAccount;
    accessToken: string;
}

export default function BuildingForm(props: Props) {
    const { location, account, accessToken } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const editable = true;

    const [oathAgree, setOathAgree] = useState<boolean>(false);
    const [loadingForm, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [buildingOwner, setBuildingOwner] = useState<BuildingOwner>({
        surname: '',
        gender: 'male',
        givenName: '',
        middleName: '',
        citizenship: '',
        suffix: '',
        owner: false
    });

    const [buildingAddress, setBuildingAddress] = useState<BuildingAddress>({
        bldgNumber: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postalCode: '',
        mainOffice: true
    });

    const [buildingInfo, setBuildingInfo] = useState<BuildingInformation>({
        dateOfCompletion: new Date(),
        estimatedCost: '',
        numberOfUnits: '',
        occupancyClassified: '',
        proposedDate: new Date(),
        totalFloorArea: ''
    })

    const [scopeOfWork, setScopeOfWork] = useState<string>("NEW CONSTRUCTION");
    const [buildingUse, setBuildingUse] = useState<string>("RESIDENTIAL DWELLINGS");
    const [installment, setInstallment] = useState<boolean>(false);
    const [engineer, setEngineer] = useState<string>("");
    const [formFiles, setFormFiles] = useState<BuildingRequirements>({
        otherFiles: []
    });

    const handlePaymentChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const installment = value == "installment" ? true : false;
        setInstallment(installment);
    })

    const handleBuildingInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingInfo({ ...buildingInfo, [event.target.name]: event.target.value });
    }

    const handleScoppeChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setScopeOfWork(value);
    });

    const handleEngineerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEngineer(event.target.value);
    }   

    const handleUseChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setBuildingUse(value);
    });

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setError(null);
    };

    const handleAddFiles = (file: File, documentType: string) => {
        if (documentType == "License") {
            setFormFiles({ ...formFiles, engineerLicense: { documentType: documentType, fileName: file.name, fileData: file } });
        } else if (documentType == "Blueprint") {
            setFormFiles({ ...formFiles, blueprint: { documentType: documentType, fileName: file.name, fileData: file } });
        } 
        else if (documentType == "Title") {
            setFormFiles({ ...formFiles, title: { documentType: documentType, fileName: file.name, fileData: file } });
        } else {
            let buildingFiles = formFiles.otherFiles;
            buildingFiles.push({ documentType: documentType, fileName: file.name, fileData: file })
            setFormFiles({ ...formFiles, otherFiles: buildingFiles });
        }
    }

    const handleRemoveFiles = (fileName: string) => {
        let buildingFiles = formFiles.otherFiles;
        const position = buildingFiles.map(file => file.fileName).indexOf(fileName);
        buildingFiles.splice(position, 1);
        setFormFiles({ ...formFiles, otherFiles: buildingFiles });
    }

    useEffect(() => {
        const zoneAddress = location.location.address.split(', ');
        const slicedDetails = zoneAddress[0].split(" ");
        let street = '';
        let bldgNumber = '';

        slicedDetails.forEach(detail => {
            if (/\d/.test(detail)) {
                bldgNumber += `${detail} `;
            } else {
                street += `${detail} `;
            }
        })

        setBuildingAddress(state => ({
            bldgNumber: bldgNumber,
            street: street,
            barangay: zoneAddress[1],
            city: zoneAddress[2],
            province: zoneAddress[3],
            mainOffice: false,
            postalCode: '',
            latitude: location.location.lat.toString(), 
            longitude: location.location.lng.toString()
        }))
    }, [location])


    const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!oathAgree) return setError("Agree to terms is required.");
        setLoading(true);

        let buildingFiles: FormFiles[] = [];
        let licenseFile = formFiles.engineerLicense;
        let blueprintFile = formFiles.blueprint;
        let titleFile = formFiles.title;

        if (!licenseFile || !blueprintFile || !titleFile) {
            setLoading(false);
            return setError("Incomplete requirements.");
        } 

        licenseFile.fileURL = await uploadFileToFirebase(account.account.uid, licenseFile.fileData as File, licenseFile.fileName);
        blueprintFile.fileURL = await uploadFileToFirebase(account.account.uid, blueprintFile.fileData as File, blueprintFile.fileName);
        titleFile.fileURL = await uploadFileToFirebase(account.account.uid, titleFile.fileData as File, titleFile.fileName);
        buildingFiles.push(licenseFile);
        buildingFiles.push(blueprintFile);
        buildingFiles.push(titleFile);

        for (let x=0; x < formFiles.otherFiles.length; x++) {
            let currentFile = formFiles.otherFiles[x];
            currentFile.fileURL = await uploadFileToFirebase(account.account.uid, currentFile.fileData as File, currentFile.fileName );
            buildingFiles.push(currentFile);
        }

        const registrationData: RegistrationData = {
            totalFloorArea: parseFloat(buildingInfo.totalFloorArea),
            estimatedCost: parseFloat(buildingInfo.estimatedCost),
            proposedDate: buildingInfo.proposedDate.toISOString(),
            dateOfCompletion: buildingInfo.dateOfCompletion.toISOString(),
            occupancyClassified: buildingInfo.occupancyClassified,
            numberOfUnits: parseInt(buildingInfo.numberOfUnits),
            surname: buildingOwner.surname,
            givenName: buildingOwner.givenName,
            middleName: buildingOwner.middleName,
            suffix: buildingOwner.suffix,
            gender: buildingOwner.gender,
            citizenship: buildingOwner.citizenship,
            bldgNumber: buildingAddress.bldgNumber,
            street: buildingAddress.street,
            barangay: buildingAddress.barangay,
            city: buildingAddress.city,
            province: buildingAddress.province,
            postalCode: parseInt(buildingAddress.postalCode as string),
            scopeOfWork: scopeOfWork,
            buildingUse: buildingUse,
            engineer: engineer,
            latitude: location.location.lat,
            longitude: location.location.lng,
            files: buildingFiles
        }

        const body = JSON.stringify(registrationData);
        const submitResult = await apiPostRequest('/building/register', body, accessToken);

        if (submitResult.status > 300) {
            setLoading(false);
            return setError(submitResult.message);
        }
        else {
            setLoading(false);
            router.push("/dashboard/building/assessment/" + (submitResult.data as SubmittedForm).buildingId );
        }
    }

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
    );
    const handleOwnerTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingOwner({ ...buildingOwner, [event.target.name]: event.target.value });
    }

    const handleGenderChange = (gender: string) => {
        setBuildingOwner({ ...buildingOwner, gender: gender });
    }

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingAddress({ ...buildingAddress, [event.target.name]: event.target.value });
    }

    const handleDateChange = (newValue: Date, name: string) => {
        setBuildingInfo({ ...buildingInfo, [name]: newValue });
    };

  return (
    <>
        <Head>
            <title>
                Registration Form | Building Permit
            </title>
        </Head>
        <Container component="form" onSubmit={handleSubmitForm}>
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                mt: 5, 
                mb: 5
                }}>
                    <Typography component="h1" variant="h5" color="secondary" sx={{ pr: 2 }}>
                        Application for Building Permit
                    </Typography>
            </Box>

            <Paper elevation={16} sx={{ p: 2 }}>
                <StepProgress step={1} />
            </Paper>

            <Stack direction="column" spacing={3} sx={{ mt: 4 }}>

                <Box component={Paper} sx={{ p: 3 }} elevation={15}>

                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >

                        <Typography 
                            component="div" 
                            variant={matches ? 'h6' : 'h5'} 
                            color="primary" align="center" 
                            sx={{ 
                                minHeight: 120, 
                                width: '100%', 
                                display: 'flex', 
                                alignItems: 'center' ,
                                justifyContent: 'center'
                            }}>
                            <strong>Registration Form</strong>
                        </Typography>
                        
                        <ApplicationOwner 
                            owner={buildingOwner}
                            handleTextChange={handleOwnerTextChange}
                            handleGenderChange={handleGenderChange}
                            editable={editable}
                        />

                        <BuildingInfo 
                            buildingInfo={buildingInfo}
                            editable={editable}
                            handleTextChange={handleBuildingInfoChange}
                            handleDateChange={handleDateChange}
                        />

                        <BuildingAddress 
                            address={buildingAddress}
                            editable={editable}
                            label="BUILDING ADDRESS"
                            handleValueChange={handleAddressChange}
                        />

                        <FormRadioGroup 
                                choices={ScopeOfWork}
                                value={scopeOfWork ? scopeOfWork : "NEW CONSTRUCTION"}
                                handleValueChange={editable ? handleScoppeChange : undefined}
                                header="SCOPE OF WORK"
                        />  

                        <FormRadioGroup 
                            choices={BuildingUse}
                            value={buildingUse ? buildingUse : "RESIDENTIAL DWELLINGS"}
                            handleValueChange={editable ? handleUseChange : undefined}
                            header="USE OR CHARACTER OF OCCUPANCY"
                        />   

                        <DocumentRequirements 
                            addFormFiles={handleAddFiles}
                            removeFile={handleRemoveFiles}
                            editable={editable}
                            formFiles={formFiles}
                            engineer={engineer}
                            handleTextChange={handleEngineerChange}
                        />  

                         <FormRadioGroup 
                            choices={PaymentTypes}
                            value={installment ? "installment" : "full"}
                            handleValueChange={editable ? handlePaymentChange : undefined}
                            header="MODE OF PAYMENT"
                        />        

                    </motion.div>

                </Box>
                <Paper elevation={15} sx={{ mt: 4 }}>
                    <FormControlLabel 
                        control={<Checkbox />} 
                        label="I DECLARE UNDER PENALTY OF PERJURY that all information in this application are true and correct based on my personal knowledge and authentic
                        records submitted to the Local Government. Any false or misleading information supplied, or production of documents shall be a ground for appropriate
                        legal action against me. I also agree to comply with the post-regulatory requirements and other deficiencies (for renewal) within 30 days from release
                        of the permit. Further, I hereby authorize and consent the Local Government to treat any personal data provided in this application with utmost
                        confidentiality." 
                        sx={{ m: 4, display: 'flex', alignItems: 'start' }}
                        checked={oathAgree}
                        onChange={() => setOathAgree(!oathAgree)}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%', mt: 4 }}>
                        <LoadingButton
                            size='large'
                            variant='contained'
                            loading={loadingForm}
                            sx={{ width: { xs: '100%', sm: '50%', md: '35%' }, m: 4 }}
                            type="submit"
                        >
                            Submit Form
                        </LoadingButton>
                    </Box>
                </Paper>

            </Stack>

            <Snackbar
                open={Boolean(error != null)}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                message={error}
                action={action}
            />

            <Copyright />

        </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res } = context;
  
    const data = parseCookies(req);
  
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return {
        redirect: {
          permanent: false,
          destination: "/signin"
        }
      }
    }

    if (data.registerBusiness == undefined) {
        return {
            redirect: {
              permanent: false,
              destination: "/dashboard/business/new/zoning"
            }
        }
    }

    const zoning = JSON.parse(data.registerBusiness);
    const account = await apiGetRequest('/accounts/search', data.loggedInUser);

    return {
      props: {
        accessToken: data.loggedInUser,
        location: zoning,
        account: account.data
      }
    }
}