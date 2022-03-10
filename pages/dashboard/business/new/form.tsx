import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import parseCookies from '../../../../config/parseCookie';
import { apiGetRequest, apiPostRequest } from '../../../../hocs/axiosRequests';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { BusinessTypes, Location } from './zoning';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { RegisterFormInterface, Organization, BusinessActivity } from "../../../../components/business/client/businessTypes";
import uploadFileToFirebase from '../../../../hocs/uploadFile';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const BusinessInformation = dynamic(() => import("../../../../components/business/client/BusinessInformation"));
const BusinessAdress = dynamic(() => import("../../../../components/business/client/BusinessAddress"));
const OwnerInformation = dynamic(() => import("../../../../components/business/client/OwnerInformation"));
const ContactInformation = dynamic(() => import("../../../../components/business/client/ContactInformation"));
const FormRadioGroup = dynamic(() => import("../../../../components/business/client/FormRadioGroup"));
const DocumentReqs = dynamic(() => import("../../../../components/business/client/DocumentReqs"));
const EmployeeInformation = dynamic(() => import("../../../../components/business/client/EmployeeInformation"));
const BusinessOperations = dynamic(() => import("../../../../components/business/client/BusinessOperations"));
const ServicesTable = dynamic(() => import("../../../../components/business/client/ServicesTable"));
const StepProgress = dynamic(() => import("../../../../components/StepProgress"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

type ZoningCookie = {
    location: Location,
    business: BusinessTypes
}

type BusinessAdresses = {
    bldgNumber: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: number | '';
    mainOffice: boolean;
    latitude?: string;
    longitude?: string;
}

type Files = {
    fileName: string;
    fileURL?: string;
    documentType: string;
    fileData?: File;
}

type ZoningResult = {
    zone: {
        zoneBase: string;
        zoneCode: string;
    },
    overlay: {
        overlayBase: string;
        overlayCode: string;
    },
    businessTypes: BusinessTypes[]
}

type DocumentTypes = "Proof of Registration" | "Tax Incentive Certificate" | "Contract of Lease" | "Tax Declaration" | "Other Requirements";

type BusinessServices = {
    productService: string;
    psicCode: string | null;
    businessTypeId: number;
    businessType: {
        typeName: string;
    }
}

type BusinessOwners = {
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    owner: boolean;
    citizenship: string | null;
    gender: string;
}

interface FormData {
    registrationNumber: string | null;
    TIN: string | null;
    businessName: string | null;
    tradeName: string | null;
    telephone: string | null;
    mobile: string | null;
    email: string | null;
    website: string | null;
    orgType: string | null;
    filipinoEmployees: string | null;
    foreignEmployees: string | null;
    businessArea: string | null;
    totalFloors: string | null;
    maleEmployees: string | null;
    femaleEmployees: string | null;
    totalEmployees: string | null;
    lguEmployees: string | null;
    deliveryUnits: string | null;
    activity: string | null;
    capital: string | null;
    taxIncentive: boolean;
    rented: boolean;
    quarterPayment?: boolean;
}

interface BusinessFiles {
    taxIncentiveFile?: Files;
    rentedFile?: Files;
    registrationFile?: Files;
    otherFiles: Files[];
}

interface SubmittedForm {
    submittedForm: FormData & {
        businessId: number;
    }
}

const OrganizationTypes = [
    { value: "sole proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "corporation", label: "Corporation" },
    { value: "cooperative", label: "Cooperative" }
];

const ActivityTypes = [
    { value: "main office", label: "Main Office" },
    { value: "branch", label: "Branch" },
    { value: "single establishment", label: "Single Establishment" },
    { value: "establishment and main office", label: "Establishment and Main Office" }
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
    accessToken: string;
    zoning: ZoningCookie;
    lineOfBusiness: ZoningResult;
    account: UserAccount;
}

export default function RegistrationForm({ accessToken, zoning, lineOfBusiness, account }: Props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();
    const editable = true;
    const [businessInfo, setBusinessInfo] = useState<FormData>({
        registrationNumber: null,
        TIN: null,
        businessName: null,
        tradeName: null,
        telephone: null,
        mobile: null,
        email: null,
        website: null,
        orgType: "sole proprietorship",
        filipinoEmployees: null,
        foreignEmployees: null,
        businessArea: null,
        totalFloors: null,
        maleEmployees: null,
        femaleEmployees: null,
        totalEmployees: null,
        lguEmployees: null,
        deliveryUnits: null,
        activity: "main office",
        capital: null,
        taxIncentive: false,
        rented: false,
        quarterPayment: false
    });

    const [mainOffice, setMainOffice] = useState<BusinessAdresses>({
        bldgNumber: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postalCode: '',
        mainOffice: true
    });

    const [businessAddress, setBusinessAddress] = useState<BusinessAdresses>({
        bldgNumber: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        postalCode: '',
        mainOffice: false
    });

    const [ownerList, setOwnerList] = useState<BusinessOwners[]>([]);
    const [businessServices, setBusinessServices] = useState<BusinessServices[]>([]);
    const [formFiles, setFormFiles] = useState<BusinessFiles>({
        otherFiles: []
    });
    const [oathAgree, setOathAgree] = useState<boolean>(false);
    const [loadingForm, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let initialService: BusinessServices[] = [];
        initialService.push({
            businessType: { typeName: zoning.business.typeName },
            businessTypeId: zoning.business.typeId,
            productService: '',
            psicCode: ''
        })
        setBusinessServices(state => initialService);
    }, [zoning])

    useEffect(() => {
        const zoneAddress = zoning.location.address.split(', ');
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

        setBusinessAddress(state => ({
            bldgNumber: bldgNumber,
            street: street,
            barangay: zoneAddress[1],
            city: zoneAddress[2],
            province: zoneAddress[3],
            mainOffice: false,
            postalCode: '',
            latitude: zoning.location.lat.toString(), 
            longitude: zoning.location.lng.toString()
        }))
    }, [zoning])

    const handleOrgTypeChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setBusinessInfo({ ...businessInfo, orgType: value });
    });

    const handleActivityChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setBusinessInfo({ ...businessInfo, activity: value });
    });

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessInfo({ ...businessInfo, [event.target.name]: event.target.value });
    }

    const handleMainOfficeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMainOffice({ ...mainOffice, [event.target.name]: event.target.value });
    }

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessAddress({ ...businessAddress, [event.target.name]: event.target.value });
    }

    const handleCopyMainOffice = ((event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        if (checked) {
            setBusinessAddress({ 
                bldgNumber: mainOffice.bldgNumber,
                street: mainOffice.street,
                barangay: mainOffice.barangay,
                city: mainOffice.city,
                province: mainOffice.province,
                postalCode: mainOffice.postalCode,
                mainOffice: false
            });
        }
    })

    const handlePaymentChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const installment = value == "installment" ? true : false;
        setBusinessInfo({ ...businessInfo, quarterPayment: installment });
    })

    const handleAddOwner = (value: BusinessOwners) => {
        let businessOwners = ownerList;
        businessOwners.push(value);
        setOwnerList(businessOwners);
    }

    const handleRemoveOwner = (name: string) => {
        setOwnerList(owners => owners.filter(owner => owner.givenName != name));
    }

    const handleAddService = (service: BusinessServices) => {
        let services = businessServices;
        services.push(service);
        setBusinessServices(services);
    }

    const handleRemoveService = (value: BusinessServices) => {
        setBusinessServices(services => services.filter(service => service.businessTypeId != value.businessTypeId && service.productService != value.productService));
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setBusinessInfo({ ...businessInfo, [name]: checked });
    }

    const handleAddFiles = (file: File, documentType: DocumentTypes) => {
        if (documentType == "Contract of Lease" || documentType == "Tax Declaration") {
            setFormFiles({ ...formFiles, rentedFile: { documentType: documentType, fileName: file.name, fileData: file } });
        } else if (documentType == "Proof of Registration") {
            setFormFiles({ ...formFiles, registrationFile: { documentType: documentType, fileName: file.name, fileData: file } });
        } else if (documentType == "Tax Incentive Certificate") {
            setFormFiles({ ...formFiles, taxIncentiveFile: { documentType: documentType, fileName: file.name, fileData: file } });
        } else {
            let businessFiles = formFiles.otherFiles;
            businessFiles.push({ documentType: documentType, fileName: file.name, fileData: file })
            setFormFiles({ ...formFiles, otherFiles: businessFiles });
        }
    }

    const handleRemoveFiles = (fileName: string) => {
        let businessFiles = formFiles.otherFiles;
        const position = businessFiles.map(file => file.fileName).indexOf(fileName);
        businessFiles.splice(position, 1);
        setFormFiles({ ...formFiles, otherFiles: businessFiles });
    }

    const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!oathAgree) return setError("Agree to terms is required.");
        setLoading(true);
        const businessOwner = ownerList.find(owner => owner.owner);
        if (!businessOwner) return setError("OIC / President is not defined.")

        let businessFiles: Files[] = [];
        let taxFile = formFiles.taxIncentiveFile;
        let regFile = formFiles.registrationFile;
        let rentFile = formFiles.rentedFile;

        if (!regFile || !rentFile) {
            setLoading(false);
            return setError("Incomplete requirements.");
        } 

        regFile.fileURL = await uploadFileToFirebase(account.account.uid, regFile.fileData as File, regFile.fileName);
        rentFile.fileURL = await uploadFileToFirebase(account.account.uid, rentFile.fileData as File, rentFile.fileName);
        businessFiles.push(regFile);
        businessFiles.push(rentFile);

        if (taxFile) {
            taxFile.fileURL = await uploadFileToFirebase(account.account.uid, taxFile.fileData as File, taxFile.fileName);
            businessFiles.push(taxFile);
        }

        formFiles.otherFiles.forEach(async (file) => {
            file.fileURL = await uploadFileToFirebase(account.account.uid, file.fileData as File, file.fileName );
            businessFiles.push(file);
        })

        const registrationData: RegisterFormInterface = {
            registrationNumber: businessInfo.registrationNumber as string,
            TIN: businessInfo.TIN as string,
            businessName: businessInfo.businessName as string,
            tradeName: businessInfo.tradeName as string,
            telephone: businessInfo.telephone as string,
            mobile: businessInfo.mobile as string,
            email: businessInfo.email as string,
            website: businessInfo.website,
            orgType: businessInfo.orgType as Organization,
            filipinoEmployees: parseInt(businessInfo.filipinoEmployees as string),
            foreignEmployees: parseInt(businessInfo.foreignEmployees as string),
            businessArea: parseFloat(businessInfo.businessArea as string),
            totalFloors: parseInt(businessInfo.totalFloors as string),
            maleEmployees: parseInt(businessInfo.maleEmployees as string),
            femaleEmployees: parseInt(businessInfo.femaleEmployees as string),
            totalEmployees: parseInt(businessInfo.maleEmployees as string) + parseInt(businessInfo.femaleEmployees as string),
            lguEmployees: parseInt(businessInfo.lguEmployees as string),
            deliveryUnits: parseInt(businessInfo.deliveryUnits as string),
            activity: businessInfo.activity as BusinessActivity,
            capital: parseFloat(businessInfo.capital as string),
            taxIncentive: businessInfo.taxIncentive,
            rented: businessInfo.rented,
            mainOffice: {
                bldgNumber: mainOffice.bldgNumber,
                street: mainOffice.street,
                barangay: mainOffice.barangay,
                city: mainOffice.city,
                postalCode: parseInt(mainOffice.postalCode as string),
                province: mainOffice.province,
                mainOffice: mainOffice.mainOffice,
            },
            businessAddress: {
                bldgNumber: businessAddress.bldgNumber,
                street: businessAddress.street,
                barangay: businessAddress.barangay,
                city: businessAddress.city,
                postalCode: parseInt(businessAddress.postalCode as string),
                province: businessAddress.province,
                mainOffice: businessAddress.mainOffice,
                latitude: zoning.location.lat, 
                longitude: zoning.location.lng
            },
            owner: businessOwner as BusinessOwners,
            quarterPayment: false,
            partners: ownerList.filter(owner => !owner.owner),
            services: businessServices.map(service => ({  productService: service.productService, businessTypeId: service.businessTypeId, psicCode: service.psicCode })),
            files: businessFiles.map(file => ({ fileURL: file.fileURL as string, fileName: file.fileName, documentType: file.documentType }))
        }

        const body = JSON.stringify(registrationData);
        const submitResult = await apiPostRequest('/business/new/form/submit', body, accessToken);

        if (submitResult.status > 300) {
            setLoading(false);
            return setError(submitResult.message);
        }
        else {
            setLoading(false);
            router.push("/dashboard/business/new/assessment/" + (submitResult.data as SubmittedForm).submittedForm.businessId );
        }
    }

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setError(null);
      };

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
    

    return (
        <>
            <Head>
                <title>
                    Registration Form | New Business
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
                            Application for New Business Permit
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
                            
                            <FormRadioGroup 
                                choices={OrganizationTypes}
                                value={businessInfo.orgType ? businessInfo.orgType : "sole proprietorship"}
                                handleValueChange={editable ? handleOrgTypeChange : undefined}
                                header="FORM OF ORGANIZATION"
                            />
                    
                            <BusinessInformation 
                                formData={businessInfo} 
                                handleValueChange={handleTextChange} 
                                editable={editable} 
                            />

                            <BusinessAdress 
                                address={mainOffice} 
                                label="MAIN OFFICE ADDRESS" 
                                handleValueChange={handleMainOfficeChange}
                                editable={editable} 
                            />

                            <ContactInformation 
                                formData={businessInfo} 
                                handleValueChange={handleTextChange} 
                                editable={editable} 
                            />

                            <OwnerInformation 
                                addOwner={handleAddOwner}
                                removeOwner={handleRemoveOwner}
                                owners={ownerList}
                                editable={editable}
                            />

                            <EmployeeInformation 
                                formData={businessInfo}
                                handleValueChange={handleTextChange} 
                                editable={editable}
                            />

                            <BusinessOperations 
                                formData={businessInfo}
                                handleValueChange={handleTextChange} 
                                editable={editable}
                            />

                            <BusinessAdress 
                                address={businessAddress} 
                                label="BUSINESS LOCATION ADDRESS" 
                                handleValueChange={handleAddressChange} 
                                handleCopy={handleCopyMainOffice}
                                editable={editable} 
                            />

                            <FormRadioGroup 
                                choices={ActivityTypes}
                                value={businessInfo.activity ? businessInfo.activity : "main office"}
                                handleValueChange={editable ? handleActivityChange : undefined}
                                header="BUSINESS ACTIVITY"
                            />

                            <ServicesTable 
                                services={businessServices}
                                addSerrvice={handleAddService}
                                removeService={handleRemoveService}
                                editable={editable}
                                lineOfBusiness={lineOfBusiness.businessTypes}
                            />

                            <DocumentReqs 
                                formData={businessInfo}
                                handleCheckChange={handleCheckboxChange}
                                removeFile={handleRemoveFiles}
                                formFiles={formFiles}
                                addFormFiles={handleAddFiles}
                                editable={editable}
                            />

                            <FormRadioGroup 
                                choices={PaymentTypes}
                                value={businessInfo.quarterPayment ? "installment" : "full"}
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
    );
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
    const finalLocation = zoning.location.address.split(', ');

    const body = JSON.stringify({
        street: finalLocation[0],
        barangay: finalLocation[1]
    })

    const result = await apiPostRequest('/business/new/zone/get', body, data.loggedInUser);
    const account = await apiGetRequest('/accounts/search', data.loggedInUser);

    if (result.status > 300) {
        return {
            notFound: true
        }
    }
  
    return {
      props: {
        accessToken: data.loggedInUser,
        zoning: zoning,
        lineOfBusiness: result.data,
        account: account.data
      }
    }
  }