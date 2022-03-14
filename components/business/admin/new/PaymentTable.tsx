import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { useRouter } from "next/router";
import PaymentVerifyDialog from "./PaymentVerify";

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

  type BusinessApproval = {
    approvalId: number;
    businessId: number;
    approved: boolean;
    approvalType: string;
    approvedAt: Date;
    officialId: number;
    remarks: string | null;
    trackNumber: number | null;
    required: boolean;
    approvalFee: number | null;
  }
  
  type BusinessOwners = {
    ownerId: number;
    surname: string;
    givenName: string;
    middleName: string;
    suffix: string | null;
    owner: boolean;
    citizenship: string | null;
    gender: string;
  }
  
  type BusinessAdresses = {
    addressId: number;
    bldgNumber: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: number;
    mainOffice: boolean;
  }

  type BusinessPayments = {
    paymentId: number;
    amount: string;
    paid: boolean;
    newBusiness: boolean;
    issuedAt: Date;
    transactionId: string | null;
    paidAt: Date | null;
    receipt: string | null;
    businessId: number;
    rejected: boolean;
    rejectMessage: string | null;
  }
  
  interface Props {
    forms: {
      businessId: number;
      businessName: string;
      submittedAt: Date;
      addresses: BusinessAdresses[];
      TIN: string;
      owners: BusinessOwners[];
      approvals: BusinessApproval[];
      payments: BusinessPayments[];
    }[]
  }

const PaymentTable = (props: Props) => {
  const { forms } = props;
  const router = useRouter();
  const theme = useTheme();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState({
    paymentId: 0,
    fileURL: '',
    businessId: 0
  });
  const [updatedForms, setUpdatedForms] = useState(forms);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setUpdatedForms(updatedForms.filter(form => form.businessId != currentPayment.paymentId));
    setCurrentPayment({ paymentId: 0, fileURL: '', businessId: 0 });
    setOpenDialog(false);
  }

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, paymentId: number, fileURL: string | null, businessId: number) => {
    if (fileURL) {
      setCurrentPayment({
        paymentId: paymentId,
        fileURL: fileURL,
        businessId: businessId
      })
      setOpenDialog(true);
    }
  }

  return (
    <Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Business Name
                </TableCell>
                <TableCell>
                  TIN Number
                </TableCell>
                <TableCell>
                  Location
                </TableCell>
                <TableCell>
                  Registration Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedForms.slice(page * limit, page * limit + limit).map((form) => {
                const paid = form.payments.find((payment) => payment.paid);
                const businessLocation = form.addresses.find(address => !address.mainOffice);
                const location = businessLocation ? businessLocation.bldgNumber + ' ' + businessLocation.street + ' ' + businessLocation.barangay : '';

                return (
                <TableRow
                  hover
                  onClick={paid ? (event) => handleRowClick(event, paid.paymentId, paid.receipt, form.businessId) : undefined}
                  sx={{ cursor: "pointer" }}
                  key={form.businessId}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {getInitials(form.businessName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {form.businessName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {form.TIN}
                  </TableCell>
                  <TableCell>
                    {location}
                  </TableCell>
                  <TableCell>
                    {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <LinearProgress value={(form.approvals.length / 6) * 100} variant="determinate" color="primary" />
                  </TableCell>
                </TableRow>
              )})}
              {forms.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ 
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3, 
                      flexDirection: 'column'
                    }}>
                      <Image 
                        src="/icons/assess_icon.png"
                        alt='sucess'
                        width={300}
                        height={300}
                      />  
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        All Renew Business Forms are assessed successfully
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      <TablePagination
        component="div"
        count={updatedForms.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <PaymentVerifyDialog 
        open={openDialog}
        handleClose={handleDialogClose}
        fileURL={currentPayment.fileURL}
        paymentId={currentPayment.paymentId}
      />
    </Card>
  );
};

export default PaymentTable;
