export type BuildingOwner = {
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    owner: boolean;
    citizenship: string | null;
    gender: string;
}

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export type BuildingAddress = {
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

export interface BuildingInformation {
    totalFloorArea: string;
    estimatedCost: string;
    proposedDate: Date;
    dateOfCompletion: Date;
    occupancyClassified: string;
    numberOfUnits: string;
}

export type FormFiles = {
    fileName: string;
    fileURL?: string;
    documentType: string;
    fileData?: File;
}

export interface BuildingRequirements {
    engineerLicense?: FormFiles;
    blueprint?: FormFiles;
    title?: FormFiles;
    otherFiles: FormFiles[];
}

export type RegistrationData = {
    totalFloorArea: number;
    estimatedCost: number;
    proposedDate: string;
    dateOfCompletion: string;
    occupancyClassified: string;
    numberOfUnits: number;
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    gender: string;
    citizenship: string | null;
    bldgNumber: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: number;
    scopeOfWork: string;
    buildingUse: string;
    engineer: string;
    latitude: number | null;
    longitude: number | null;
    files: FormFiles[];
}

type BuildingFiles = {
    fileId: number;
    buildingId: number;
    fileName: string;
    fileURL: string;
    documentType: string;
    submittedAt: Date;
}

export type SubmittedForm = {
    buildingId: number;
    totalFloorArea: string;
    estimatedCost: string;
    proposedDate: string;
    dateOfCompletion: string;
    occupancyClassified: string;
    numberOfUnits: number;
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    gender: string;
    citizenship: string | null;
    bldgNumber: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: number;
    scopeOfWork: string;
    buildingUse: string;
    engineer: string;
    latitude?: string;
    longitude?: string;
    approved: boolean;
    submittedAt: Date;
    trackNumber: number | null;
    releaseDate: Date | null;
    certificateFile: string | null;
    quarterPayment: boolean;
    files: BuildingFiles[];
    payments: BuildingPayments[];
    approvals: BuildingApproval[];
}

export type BuildingApproval = {
    approvalId: number;
    approved: boolean;
    approvalType: string;
    approvedAt: Date;
    official: {
        firstName: string;
        lastName: string;
    };
    remarks: string | null;
    required: boolean;
    approvalFee: string | null;
}

export type BuildingPayments = {
    paymentId: number;
    amount: string;
    paid: boolean;
    issuedAt: Date;
    transactionId: string | null;
    paidAt: Date | null;
    receipt: string | null;
    rejected: boolean;
    rejectMessage: string | null;
    buildingId: number;
}