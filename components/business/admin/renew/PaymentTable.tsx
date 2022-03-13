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
  Typography,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from "next/router";
import PaymentVerifyDialog from "./PaymentVerify";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

  type BusinessPayments = {
    paymentId: number;
    amount: string;
    paid: boolean;
    newBusiness: boolean;
    issuedAt: Date;
    transactionId: string | null;
    paidAt: Date | null;
    receipt: string | null;
    renewalId: number;
    rejected: boolean;
    rejectMessage: string | null;
  }
  
  interface Props {
    forms: {
      business: {
        renewalId: number;
        businessName: string;
        TIN: string;
        certificateId: string;
      },
      renewalId: number;
      businessId: number | null;
      permitNumber: string;
      receiptNumber: string | null;
      renewAt: Date;
      completed: boolean;
      businessName: string | null;
      receiptFile: string;
      quarterly: boolean;
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
    renewalId: 0
  });
  const [updatedForms, setUpdatedForms] = useState(forms);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setUpdatedForms(updatedForms.filter(form => form.renewalId != currentPayment.paymentId));
    setCurrentPayment({ paymentId: 0, fileURL: '', renewalId: 0 });
    setOpenDialog(false);
  }

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>, paymentId: number, fileURL: string | null, renewalId: number) => {
    if (fileURL) {
      setCurrentPayment({
        paymentId: paymentId,
        fileURL: fileURL,
        renewalId: renewalId
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
                  {"Mayor's Permit Number"}
                </TableCell>
                <TableCell>
                  Last Receipt Number
                </TableCell>
                <TableCell>
                  Business Name
                </TableCell>
                <TableCell>
                  Renewal Date
                </TableCell>
                <TableCell padding="checkbox">
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedForms.slice(page * limit, page * limit + limit).map((form) => {
                const paid = form.payments.find((payment) => payment.paid);

                return (
                <TableRow
                  hover
                  sx={{ cursor: "pointer" }}
                  key={form.renewalId}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {form.permitNumber ? form.permitNumber : form.business.certificateId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {form.receiptNumber}
                  </TableCell>
                  <TableCell>
                    {form.business ? form.business.businessName : form.businessName}
                  </TableCell>
                  <TableCell>
                    {new Date(form.renewAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Tooltip title="View Payment">
                        <IconButton onClick={paid ? (event) => handleRowClick(event, paid.paymentId, paid.receipt, form.renewalId) : undefined}>
                          <ReceiptLongIcon />
                        </IconButton>  
                      </Tooltip>   
                    </Stack>
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
