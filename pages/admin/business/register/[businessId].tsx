import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import parseCookies from '../../../../config/parseCookie';
import { apiGetRequest, apiPostRequest } from '../../../../hocs/axiosRequests';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import uploadTOPToFirebase from '../../../../hocs/uploadTaxPayment';
import { useLoadScript } from '@react-google-maps/api';

const BusinessInformation = dynamic(() => import("../../../../components/business/client/BusinessInformation"));
const BusinessAdress = dynamic(() => import("../../../../components/business/client/BusinessAddress"));
const OwnerInformation = dynamic(() => import("../../../../components/business/client/OwnerInformation"));
const ContactInformation = dynamic(() => import("../../../../components/business/client/ContactInformation"));
const FormRadioGroup = dynamic(() => import("../../../../components/business/client/FormRadioGroup"));
const DocumentReqs = dynamic(() => import("../../../../components/business/client/DocumentReqs"));
const EmployeeInformation = dynamic(() => import("../../../../components/business/client/EmployeeInformation"));
const AssessmentDialog = dynamic(() => import("../../../../components/business/admin/new/AssessmentDialog"));
const TrackingDialog = dynamic(() => import("../../../../components/business/admin/new/TrackingDialog"));
const TaxPaymentDialog = dynamic(() => import("../../../../components/business/admin/new/TaxPaymentDialog"));
const ApprovalDialog = dynamic(() => import("../../../../components/business/admin/new/ApprovalDialog"));
const BusinessOperations = dynamic(() => import("../../../../components/business/client/BusinessOperations"));
const ServicesTable = dynamic(() => import("../../../../components/business/client/ServicesTable"));
const ZoningMap = dynamic(() => import("../../../../components/business/client/ZoningMap"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));
const SpeedAction = dynamic(() => import("../../../../components/SpeedDial"));

type BusinessRegistry = {
    registrationNumber: string;
    TIN: string;
    businessName: string;
    tradeName: string;
    telephone: string;
    mobile: string;
    email: string;
    website: string | null;
    orgType: string;
    filipinoEmployees: number;
    foreignEmployees: number;
    businessArea: number;
    totalFloors: number;
    maleEmployees: number;
    femaleEmployees: number;
    totalEmployees: number;
    lguEmployees: number;
    deliveryUnits: number;
    activity: string;
    capital: number;
    taxIncentive: boolean;
    rented: boolean;
    submittedAt: Date;
    certificateId: string | null;
    approved: boolean;
    taxAmount: number | null;
    archived: boolean;
    trackNumber: number | null;
    quarterPayment: boolean;
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

type DocumentTypes = "Proof of Registration" | "Tax Incentive Certificate" | "Contract of Lease" | "Tax Declaration" | "Other Requirements" | "Zone Appeal";

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

type BusinessApproval = {
    approved: boolean;
    approvalType: string;
    approvedAt: Date;
    required: boolean;
    approvalFee: number | null;
    official: {
        firstName: string;
        lastName: string;
    }
}

type BusinessPayments = {
    paymentId: number;
    amount: number;
    paid: boolean;
    newBusiness: boolean;
    issuedAt: Date;
    paidAt: Date | null;
    businessId: number;
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
    zoneAppeal?: Files;
    otherFiles: Files[];
}

type AdminAccount = {
    adminAccount: {
        email: string;
        userId: number;
        uid: string;
    },
    roles: string[]
}

interface Props {
    accessToken: string;
    account: AdminAccount;
    businessId: number;
    form: BusinessRegistry & {
        services: BusinessServices[];
        files: Files[];
        addresses: BusinessAdresses[];
        owners: BusinessOwners[];
        approvals: BusinessApproval[];
        payments: BusinessPayments[];
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

type libray = "places" | "drawing" | "geometry" | "localContext" | "visualization"

const libraries: libray[] = ['places'];

export default function BusinessRegisterForm(props: Props) {
    const { form, account, businessId, accessToken } = props;
    const theme = useTheme();
    const router = useRouter();
    const editable = false;
    const [businessInfo, setBusinessInfo] = useState<FormData>({
        registrationNumber: null,
        TIN: null,
        businessName: null,
        tradeName: null,
        telephone: null,
        mobile: null,
        email: null,
        website: null,
        orgType: null,
        filipinoEmployees: null,
        foreignEmployees: null,
        businessArea: null,
        totalFloors: null,
        maleEmployees: null,
        femaleEmployees: null,
        totalEmployees: null,
        lguEmployees: null,
        deliveryUnits: null,
        activity: null,
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
    const [approvals, setApprovals] = useState<string[]>([]);
    const [currentApproval, setCurrentApproval] = useState<string | null>(null);

    //Dialogs
    const [assessDialog, setAssessDialog] = useState<boolean>(false);
    const [trackingDialog, setTrackingDialog] = useState<boolean>(false);
    const [taxDialog, setTaxDialog] = useState<boolean>(false);
    const [approvalTable, setApprovalTable] = useState<boolean>(false);

    useEffect(() => {
        let neededApprovals: string[] = [];
        const clearance = ["PZO", "OLBO", "CHO", "CENRO", "OCMA", "BFP"];
        const currentClearance = form.approvals.map(approval => approval.approvalType);

        clearance.forEach(obj => {
           if (!currentClearance.includes(obj)) {
               neededApprovals.push(obj);
           }
        });

        const toApprove = neededApprovals.filter(obj => account.roles.includes(obj))

        setApprovals(state => toApprove);
        setCurrentApproval(state => toApprove[0]);
    }, [form, account])

    useEffect(() => {
        const initialBusinessData = {
            registrationNumber: form.registrationNumber,
            TIN: form.TIN,
            businessName: form.businessName,
            tradeName: form.tradeName,
            telephone: form.telephone,
            mobile: form.mobile,
            email: form.email,
            website: form.website,
            orgType: form.orgType,
            filipinoEmployees: form.filipinoEmployees.toString(),
            foreignEmployees: form.foreignEmployees.toString(),
            businessArea: form.businessArea.toString(),
            totalFloors: form.totalFloors.toString(),
            maleEmployees: form.maleEmployees.toString(),
            femaleEmployees: form.femaleEmployees.toString(),
            totalEmployees: form.totalEmployees.toString(),
            lguEmployees: form.lguEmployees.toString(),
            deliveryUnits: form.deliveryUnits.toString(),
            activity: form.activity,
            capital: form.capital.toString(),
            taxIncentive: form.taxIncentive,
            rented: form.rented
        };

        const mainOffice = form.addresses.find(address => address.mainOffice);
        const businessAddress = form.addresses.find(address => !address.mainOffice);

        if (mainOffice) setMainOffice(state => mainOffice);
        if (businessAddress) setBusinessAddress(state => businessAddress);

        setBusinessInfo(state => initialBusinessData);
        setOwnerList(state => form.owners);
        setBusinessServices(state => form.services);
        setFormFiles(state => ({
            otherFiles: form.files.filter(file => file.documentType == "Other Requirements"),
            registrationFile: form.files.find(file => file.documentType == "Proof of Registration"),
            zoneAppeal: form.files.find(file => file.documentType == "Zone Appeal"),
            rentedFile: form.files.find(file => file.documentType == "Contract of Lease" || file.documentType == "Tax Declaration"),
            taxIncentiveFile: form.files.find(file => file.documentType == "Tax Incentive Certificate")
        }));

    }, [form])

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
        } else if (documentType == "Zone Appeal") {
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

    const handleAssessDialog = () => {
        setAssessDialog(!assessDialog);
    }

    const handleSubmitForm = async (value: { approved: boolean, required: boolean, remarks: string, fee: number }) => {
        const { approved, required, remarks, fee } = value;
        let clearances = approvals;
        const pos = currentApproval ? approvals.indexOf(currentApproval) : -1;

        if (clearances.length != 0) {
            if (pos >= 0) {
                const body = JSON.stringify({
                    businessId: businessId,
                    approved: approved,
                    required: required,
                    remarks: remarks,
                    fee: fee,
                    type: currentApproval
                })
                const result = await apiPostRequest('/business/new/approve/add', body, accessToken);

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

    const handleTrackNumber = async (trackNum: number) => {
        const body = JSON.stringify({
            trackingNumber: trackNum
        })
        const result = await apiPostRequest('/business/new/approve/fire/track/' + businessId, body, accessToken);

        if (result.status < 300) {
            setTrackingDialog(false);
            router.push('/admin/business/register');
        }
    }

    const handleSubmitTax = async (fees: number[], document: File) => {
        try {
            const fileURL = await uploadTOPToFirebase(account.adminAccount.uid, document, document.name);

           if (fileURL) {
                fees.forEach(async (fee, index) => {
                    const body1 = JSON.stringify({
                        businessId: businessId,
                        tax: fee,
                        fileURL: fileURL
                    });

                    const body2 = JSON.stringify({
                        businessId: businessId,
                        tax: fee
                    });

                    const savedTax = await apiPostRequest('/business/new/approve/tax', index == 0 ? body1 : body2, accessToken)

                    if (savedTax.status < 300) {
                        setTaxDialog(false);
                        router.push('/admin/business/register');
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddAssessment = () => {
        setApprovalTable(false);
        setAssessDialog(true);
    }

    //maps 
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
                Business Register | Malabon Online Services
            </title>
        </Head>
        <Container>
            <Stack direction="column" spacing={3} sx={{ mt: 7 }}>

                <Typography component="h1" variant="h5" textAlign="left" sx={{ mb: 2 }} color="gray">
                    New Business | <strong style={{ color: theme.palette.primary.main }}>{form.businessName}</strong>
                </Typography>

                <Box sx={{ width: '100%', height: 500, bgcolor: "grey" }}>
                    <ZoningMap 
                        isLoaded={isLoaded}
                        loadError={loadError}
                        location={{ lat: businessAddress.latitude, lng: businessAddress.longitude }}
                        onMapLoad={onMapLoad}
                        viewOnly={true}
                    />
                </Box>

                <Box component={Paper} sx={{ p: 3 }}>
                    
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
                        lineOfBusiness={[]}
                    />

                    <DocumentReqs 
                        formData={businessInfo}
                        handleCheckChange={handleCheckboxChange}
                        removeFile={handleRemoveFiles}
                        formFiles={formFiles}
                        addFormFiles={handleAddFiles}
                        editable={editable}
                        approved={Boolean(!formFiles.zoneAppeal)}
                    />

                </Box>
            </Stack>

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

            <TrackingDialog 
                open={Boolean(trackingDialog && form.trackNumber == null)}
                handleClose={() => setTrackingDialog(!trackingDialog)}
                submitTrackNum={handleTrackNumber}
            />

            <TaxPaymentDialog 
                open={Boolean(taxDialog && form.payments.length == 0)}
                quarterPayment={form.quarterPayment}
                handleClose={() => setTaxDialog(!taxDialog)}
                submitTax={handleSubmitTax}
            />

            <ApprovalDialog 
                open={approvalTable}
                handleClose={() => setApprovalTable(!approvalTable)}
                approvals={form.approvals}
                addAssessment={handleAddAssessment}
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
  
    const result = await apiGetRequest('/business/new/form/search/' + params.businessId, data.loggedInUser);
    const account = await apiGetRequest('/accounts/admin/search', data.loggedInUser);
  
    if (result.status > 300) {
      return {
        notFound: true
      }
    }
    
  
    return {
      props: {
        accessToken: data.loggedInUser,
        account: account.data,
        businessId: parseInt(params.businessId as string),
        form: result.data
      }
    }
  }