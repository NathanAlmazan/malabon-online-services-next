
export type RealEstate = {
    estateId: number;
    declarationNum: string;
    ownerName: string;
    receiptFile: string;
    submittedAt: Date;
    completed: boolean;
    topFile: string | null;
    certificateId: string | null;
    certificateFile: string | null;
    appointment: Date | null;
    quarterly: boolean;
    accountId: number;
    payments: RealEstatePayments[];
}

export type RealEstatePayments = {
    paymentId: number;
    amount: string;
    paid: boolean;
    issuedAt: Date;
    transactionId: string | null;
    paidAt: Date | null;
    receipt: string | null;
    rejected: boolean;
    rejectMessage: string | null;
    estateId: number;
}