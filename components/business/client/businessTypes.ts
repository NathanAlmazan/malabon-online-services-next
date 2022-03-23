export interface FormData {
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
}

export type BusinessAdresses = {
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

export type BusinessOwners = {
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    owner: boolean;
    citizenship: string | null;
    gender: string;
}

export type BusinessServices = {
    productService: string;
    psicCode: string | null;
    businessTypeId: number;
    businessType: {
        typeName: string;
    }
}

export type FormFiles = {
    fileName: string;
    fileURL?: string;
    documentType: string;
    fileData?: File;
}

export interface BusinessFiles {
    taxIncentiveFile?: FormFiles;
    rentedFile?: FormFiles;
    registrationFile?: FormFiles;
    zoneAppeal?: FormFiles;
    otherFiles: FormFiles[];
}

export interface BusinessTypes {
    typeId: number;
    typeName: string;
    zoneId: number;
}

type Registration = "DTI" | "SEC" | "CDA";
export type Organization = "sole proprietorship" | "partnership" | "corporation" | "cooperative";
export type BusinessActivity = "main office" | "branch" | "single establishment" | "establishment and main office";

export interface RegisterFormInterface {
    registrationNumber: string;
    TIN: string;
    businessName: string;
    tradeName: string;
    telephone: string;
    mobile: string;
    email: string;
    website: string | null;
    orgType: Organization;
    filipinoEmployees: number;
    foreignEmployees: number;
    businessArea: number;
    totalFloors: number;
    maleEmployees: number;
    femaleEmployees: number;
    totalEmployees: number;
    lguEmployees: number;
    deliveryUnits: number;
    activity: BusinessActivity;
    capital: number;
    taxIncentive: boolean;
    rented: boolean;
    mainOffice: AddressInterface;
    businessAddress: AddressInterface;
    owner: OwnerInterface;
    quarterPayment: boolean;
    partners: OwnerInterface[];
    services: ServicesInterface[];
    files: FormFilesInterface[];
}

interface OwnerInterface {
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    owner: boolean;
    citizenship: string | null;
    gender: string;
    address?: AddressInterface;
}

interface FormFilesInterface {
    fileURL: string;
    fileName: string;
    documentType: string;
}

interface ServicesInterface {
    productService: string;
    psicCode: string | null;
    businessTypeId: number;
}

interface AddressInterface {
    bldgNumber: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: number;
    latitude?: number;
    longitude?: number;
    mainOffice: boolean;
}
