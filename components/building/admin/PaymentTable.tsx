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
import Image from 'next/image';
import PaymentVerifyDialog from "./PaymentVerify";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { SubmittedForm } from "../buildingTypes";
import { SeverityPill } from '../../dashboard/SeverityPill';
  
const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

interface Props {
  forms: SubmittedForm[];
}

const PaymentTable = (props: Props) => {
  const { forms } = props;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState({
    paymentId: 0,
    fileURL: '',
    buildingId: 0
  });
  const [updatedForms, setUpdatedForms] = useState(forms);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setUpdatedForms(updatedForms.filter(form => form.buildingId != currentPayment.paymentId));
    setCurrentPayment({ paymentId: 0, fileURL: 'https://firebasestorage.googleapis.com/v0/b/malabon-online-services.appspot.com/o/documents%2FAMd1OtvgK7Vncw4aYTL68gQw2oA2%2FALMAZAN%2C%20NATHANAEL%20A.%20ACTIVITY%204.pdf?alt=media&token=6b2babcf-362d-4759-a62c-286ca1aaf5b4', buildingId: 0 });
    setOpenDialog(false);
  }

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>, paymentId: number, fileURL: string | null, buildingId: number) => {
    if (fileURL) {
      setCurrentPayment({
        paymentId: paymentId,
        fileURL: fileURL,
        buildingId: buildingId
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
                      Owner
                  </TableCell>
                  <TableCell>
                      Scope of Work
                  </TableCell>
                  <TableCell>
                      Character of Occupancy
                  </TableCell>
                  <TableCell>
                      Registration Date
                  </TableCell>
                  <TableCell>
                      Status
                  </TableCell>
                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>
            <TableBody>
              {updatedForms.slice(page * limit, page * limit + limit).map((form) => {
                const paid = form.payments.find((payment) => payment.paid);
                const buildingOwner = form.givenName + ' ' + form.surname;

                return (
                  <TableRow
                  key={form.buildingId}
                  hover
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
                        {getInitials(buildingOwner)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {buildingOwner}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {form.scopeOfWork}
                  </TableCell>
                  <TableCell>
                    {form.buildingUse}
                  </TableCell>
                  <TableCell>
                    {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <SeverityPill color="success">
                      Paying
                    </SeverityPill>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Tooltip title="View Payment">
                        <IconButton onClick={paid ? (event) => handleRowClick(event, paid.paymentId, paid.receipt, form.buildingId) : undefined}>
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
