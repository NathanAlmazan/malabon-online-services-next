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
import { RealEstate } from './realEstateTypes';

  type BusinessPayments = {
    paymentId: number;
    amount: string;
    paid: boolean;
    newBusiness: boolean;
    issuedAt: Date;
    transactionId: string | null;
    paidAt: Date | null;
    receipt: string | null;
    estateId: number;
    rejected: boolean;
    rejectMessage: string | null;
  }
  
  interface Props {
    forms: RealEstate[];
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
    estateId: 0
  });
  const [updatedForms, setUpdatedForms] = useState(forms);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setUpdatedForms(updatedForms.filter(form => form.estateId != currentPayment.paymentId));
    setCurrentPayment({ paymentId: 0, fileURL: '', estateId: 0 });
    setOpenDialog(false);
  }

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>, paymentId: number, fileURL: string | null, estateId: number) => {
    if (fileURL) {
      setCurrentPayment({
        paymentId: paymentId,
        fileURL: fileURL,
        estateId: estateId
      })
      setOpenDialog(true);
    }
  }

  
  const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

  return (
    <Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
                <TableRow>
                  <TableCell>
                    {"Owner's Name"}
                  </TableCell>
                  <TableCell>
                    Request Number
                  </TableCell>
                  <TableCell>
                    Tax Declaration Number
                  </TableCell>
                  <TableCell>
                    Application Date
                  </TableCell>
                  <TableCell>
                    Status
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
                  key={form.estateId}
                >
                  <TableCell>
                    <Box
                      sx={{
                          alignItems: 'center',
                          display: 'flex'
                      }}
                    >
                      <Avatar
                          sx={{ mr: 2, bgcolor: '#E91E63' }}
                      >
                          {getInitials(form.ownerName)}
                      </Avatar>
                      <Typography
                          color="textPrimary"
                          variant="body1"
                      >
                          {form.ownerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {'0000' + form.estateId}
                  </TableCell>
                  <TableCell>
                    {form.declarationNum}
                  </TableCell>
                  <TableCell>
                    {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Tooltip title="View Payment">
                        <IconButton onClick={paid ? (event) => handleRowClick(event, paid.paymentId, paid.receipt, form.estateId) : undefined}>
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
                        All Real Estate Applications are assessed successfully
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
