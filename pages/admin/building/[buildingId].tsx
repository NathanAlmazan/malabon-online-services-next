import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import uploadTOPToFirebase from '../../../hocs/uploadTaxPayment';
import { useLoadScript } from '@react-google-maps/api';

const ApplicationOwner = dynamic(() => import("../../../components/building/form/applicantInformation"));
const BuildingAddress = dynamic(() => import("../../../components/building/form/BuildingAddress"));
const DocumentRequirements = dynamic(() => import("../../../components/building/form/documentRequirements"));
const BuildingInfo = dynamic(() => import("../../../components/building/form/buildingInfo"));
const FormRadioGroup = dynamic(() => import("../../../components/business/client/FormRadioGroup"));
const StepProgress = dynamic(() => import("../../../components/StepProgress"));
const Copyright = dynamic(() => import("../../../components/Copyright"));
const SpeedAction = dynamic(() => import("../../../components/building/SpeedDial"));
const ApprovalDialog = dynamic(() => import("../../../components/building/admin/ApprovalDialog"));
const AssessmentDialog = dynamic(() => import("../../../components/building/admin/AssessmentDialog"));
const TaxPaymentDialog = dynamic(() => import("../../../components/business/admin/new/TaxPaymentDialog"));
const TrackingDialog = dynamic(() => import("../../../components/business/admin/new/TrackingDialog"));
const ZoningMap = dynamic(() => import("../../../components/business/client/ZoningMap"));

type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization"

const libraries: libray[] = ['places'];

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
]

type AdminAccount = {
    adminAccount: {
        email: string;
        userId: number;
        uid: string;
    },
    roles: string[]
}

interface Props {
    form: SubmittedForm;
    account: AdminAccount;
    accessToken: string;
    buildingId: number;
}

export default function BuildingForm(props: Props) {
    const { form, account, accessToken, buildingId } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const editable = false;

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
    const [engineer, setEngineer] = useState<string>("");
    const [formFiles, setFormFiles] = useState<BuildingRequirements>({
        otherFiles: []
    });

    //Dialogs
    const [approvals, setApprovals] = useState<string[]>([]);
    const [currentApproval, setCurrentApproval] = useState<string | null>(null);
    const [assessDialog, setAssessDialog] = useState<boolean>(false);
    const [trackingDialog, setTrackingDialog] = useState<boolean>(false);
    const [taxDialog, setTaxDialog] = useState<boolean>(false);
    const [approvalTable, setApprovalTable] = useState<boolean>(false);

    useEffect(() => {
        setBuildingOwner(state => ({
            surname: form.surname,
            givenName: form.givenName,
            middleName: form.middleName,
            citizenship: form.citizenship,
            gender: form.gender,
            suffix: form.suffix,
            owner: true
        }));

        setBuildingAddress(state => ({
            barangay: form.barangay,
            bldgNumber: form.bldgNumber,
            city: form.city,
            postalCode: form.postalCode,
            province: form.province,
            street: form.street,
            mainOffice: false
        }))

        setBuildingInfo(state => ({
            dateOfCompletion: new Date(form.dateOfCompletion),
            proposedDate: new Date(form.proposedDate),
            estimatedCost: form.estimatedCost,
            numberOfUnits: form.numberOfUnits.toString(),
            occupancyClassified: form.occupancyClassified,
            totalFloorArea: form.totalFloorArea
        }));

        setScopeOfWork(state => form.scopeOfWork);
        setBuildingUse(state => form.buildingUse);
        setEngineer(state => form.engineer);

        setFormFiles(state => ({
            blueprint: form.files.find(file => file.documentType == "Blueprint"),
            engineerLicense: form.files.find(file => file.documentType == "License"),
            otherFiles: form.files.filter(file => file.documentType == "Other Requirements")
        }))

        let neededApprovals: string[] = [];
        const clearance = ["FENCING", "ARCHITECTURAL", "STRUCTURAL", "ELECTRICAL", "MECHANICAL", "BFP", "SANITARY", "PLUMBING", "INTERIOR", "ELECTRONICS"];
        const currentClearance = form.approvals.map(approval => approval.approvalType);

        clearance.forEach(obj => {
           if (!currentClearance.includes(obj)) {
               neededApprovals.push(obj);
           }
        });

        const toApprove = neededApprovals.filter(obj => account.roles.includes(obj));

        setApprovals(state => toApprove);
        setCurrentApproval(state => toApprove[0]);
    }, [form, account])

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

    const handleAssessDialog = () => {
        setAssessDialog(!assessDialog);
    }

    const handleAddAssessment = () => {
        setApprovalTable(false);
        setAssessDialog(true);
    }

    const handleSubmitForm = async (value: { approved: boolean, required: boolean, remarks: string, fee: number }) => {
        const { approved, required, remarks, fee } = value;
        let clearances = approvals;
        const pos = currentApproval ? approvals.indexOf(currentApproval) : -1;

        if (clearances.length != 0) {
            if (pos >= 0) {
                const body = JSON.stringify({
                    buildingId: buildingId,
                    approved: approved,
                    required: required,
                    remarks: remarks,
                    fee: fee,
                    type: currentApproval
                })
                const result = await apiPostRequest('/building/approval/create', body, accessToken);

                if (result.status < 300) {
                    clearances.splice(pos, 1);
                    setApprovals(clearances);
                }
            }

            setCurrentApproval(clearances[0]);
        } else {
            setCurrentApproval(null);
            setAssessDialog(false);
            router.push('/admin/business/register');
        }
    }

    const handleSubmitTax = async (fees: number[], document: File) => {
        try {
            const fileURL = await uploadTOPToFirebase(account.adminAccount.uid, document, document.name);

           if (fileURL) {
                fees.forEach(async (fee, index) => {
                    const body1 = JSON.stringify({
                        buildingId: buildingId,
                        tax: fee,
                        fileURL: fileURL
                    });

                    const body2 = JSON.stringify({
                        buildingId: buildingId,
                        tax: fee
                    });

                    const savedTax = await apiPostRequest('/building/approve/tax', index == 0 ? body1 : body2, accessToken)

                    if (savedTax.status < 300) {
                        setTaxDialog(false);
                        router.push('/admin/building');
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTrackNumber = async (trackNum: number) => {
        const body = JSON.stringify({
            trackingNumber: trackNum
        })
        const result = await apiPostRequest('/building/approve/fire/track/' + buildingId, body, accessToken);

        if (result.status < 300) {
            setTrackingDialog(false);
            router.push('/admin/building');
        }
    }

    const { isLoaded, loadError  } = useLoadScript({
        googleMapsApiKey: "AIzaSyBampCnnbMpDkGIkQmZRGjU8YFARfo13Ns",
        libraries
    });

    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map: google.maps.Map) => {
      mapRef.current = map;
    }, []);

  return (
    <>
        <Head>
            <title>
                Registration Form | Building Permit
            </title>
        </Head>
        <Container component="form">
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

            <Box sx={{ width: '100%', height: 500, bgcolor: "grey" }}>
                    <ZoningMap 
                        isLoaded={isLoaded}
                        loadError={loadError}
                        location={{ lat: form.latitude, lng: form.longitude }}
                        onMapLoad={onMapLoad}
                        viewOnly={true}
                    />
            </Box>

            <Stack direction="column" spacing={3} sx={{ mt: 4 }}>

                <Box component={Paper} sx={{ p: 3 }} elevation={15}>

                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        
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

                    </motion.div>

                </Box>

            </Stack>

            <Snackbar
                open={Boolean(error != null)}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                message={error}
                action={action}
            />

            <Copyright />

            <SpeedAction 
                roles={account.roles}
                approvals={form.approvals.length}
                trackNum={Boolean(form.trackNumber != null)}
                submitAssessment={handleAssessDialog}
                openTrackDialog={() => setTrackingDialog(true)}
                openTaxDialog={() => setTaxDialog(true)}
                approvalTable={() => setApprovalTable(true)}
                goBack={() => router.back()}
            />

            <AssessmentDialog 
                open={Boolean(assessDialog && currentApproval)}
                handleClose={handleAssessDialog}
                handleSubmit={handleSubmitForm}
                currentAssessment={currentApproval}
            />

            <ApprovalDialog 
                open={approvalTable}
                handleClose={() => setApprovalTable(!approvalTable)}
                approvals={form.approvals}
                addAssessment={handleAddAssessment}
            />

            <TaxPaymentDialog 
                open={Boolean(taxDialog && form.payments.length == 0)}
                quarterPayment={form.quarterPayment}
                handleClose={() => setTaxDialog(!taxDialog)}
                submitTax={handleSubmitTax}
            />  

            <TrackingDialog 
                open={Boolean(trackingDialog && form.trackNumber == null)}
                handleClose={() => setTrackingDialog(!trackingDialog)}
                submitTrackNum={handleTrackNumber}
            />

        </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, params } = context;
  
    if (!params) return { notFound: true };
    const data = parseCookies(req);
  
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return {
        redirect: {
          permanent: false,
          destination: "/signin"
        }
      }
    }

    const account = await apiGetRequest('/accounts/admin/search', data.loggedInUser);
    const result = await apiGetRequest('/building/view/' + params.buildingId, data.loggedInUser);

    if (result.status > 300) {
        return {
          notFound: true
        }
    }

    return {
      props: {
        accessToken: data.loggedInUser,
        form: result.data,
        account: account.data,
        buildingId: parseInt(params.buildingId as string)
      }
    }
}