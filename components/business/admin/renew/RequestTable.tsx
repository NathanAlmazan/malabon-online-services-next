import { useEffect, useState } from 'react';
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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import dynamic from 'next/dynamic';
import uploadTOPToFirebase from '../../../../hocs/uploadTaxPayment';
import DateRangeIcon from "@mui/icons-material/DateRangeOutlined"
import { apiPostRequest } from '../../../../hocs/axiosRequests';

const TaxDialog = dynamic(() => import("../new/TaxPaymentDialog"));
const ClaimDialog = dynamic(() => import("./ClaimDialog"));

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
    token: string;
    uid: string;
    claim?: boolean;
    searchValue: string;
    forms: {
      business: {
        businessId: number;
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
    }[];
  }

const RequestListResults = (props: Props) => {
  const { forms, searchValue, token, uid, claim } = props;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [updatedForms, setUpdatedForms] = useState(forms);
  const [openTax, setOpenTax] = useState<boolean>(false);
  const [selectedRenew, setSelectedRenew] = useState<number>(0);
  const [renewDialog, setRenewDialog] = useState<boolean>(false);
  const [selected, setSelected] = useState({
    renewalId: 0,
    quarterly: false
  });

  useEffect(() => {
    setUpdatedForms(state => forms.filter(form => form.permitNumber ? form.permitNumber.includes(searchValue) : form.business.certificateId.includes(searchValue)));
  }, [forms, searchValue]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleViewReceipt = (path: string) => {
    window.open(path);
  }

  const handleClaimDialog = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setSelectedRenew(id);
    setRenewDialog(true);
    setUpdatedForms(updatedForms.filter(form => form.renewalId != id));
  }

  const handleSubmitTax = async (fees: number[], document: File) => {
    try {
        const fileURL = await uploadTOPToFirebase(uid, document, document.name);

       if (fileURL && selected.renewalId != 0) {
            fees.forEach(async (fee, index) => {
                const body1 = JSON.stringify({
                    businessId: selected.renewalId,
                    tax: fee,
                    fileURL: fileURL
                });

                const body2 = JSON.stringify({
                    businessId: selected.renewalId,
                    tax: fee
                });

                const savedTax = await apiPostRequest('/business/renew/tax', index == 0 ? body1 : body2, token)

                if (savedTax.status < 300) {
                  setOpenTax(false);
                }
            })

          setUpdatedForms(updatedForms.filter(f => f.renewalId != selected.renewalId));
          setSelected({
            renewalId: 0,
            quarterly: false
          });
        }
    } catch (error) {
        console.log(error)
    }
  }

  const handleSelectRenew = (id: number, quarterly: boolean) => {
    setSelected({ renewalId: id, quarterly: quarterly });
    setOpenTax(true);
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

                return (
                <TableRow
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
                    {claim ? (
                      <Stack direction="row" spacing={2}>
                      <Tooltip title="Schedule Claim">
                        <IconButton onClick={(event) => handleClaimDialog(event, form.renewalId)}>
                          <DateRangeIcon />
                        </IconButton>  
                      </Tooltip>  
                    </Stack>
                    ): (
                      <Stack direction="row" spacing={2}>
                      <Tooltip title="View Last Receipt">
                        <IconButton onClick={() => handleViewReceipt(form.receiptFile)}>
                          <ReceiptLongIcon />
                        </IconButton>  
                      </Tooltip>  
                      <Tooltip title="Assessment">
                        <IconButton onClick={() => handleSelectRenew(form.renewalId, form.quarterly)}>
                          <FindInPageIcon />
                        </IconButton>  
                      </Tooltip>  
                    </Stack>
                    )}
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
      <TaxDialog 
        open={openTax}
        handleClose={() => setOpenTax(false)}
        submitTax={handleSubmitTax}
        quarterPayment={selected.quarterly}
      />
      <ClaimDialog 
        open={renewDialog}
        handleClose={() => setRenewDialog(false)}
        renewalId={selectedRenew}
      />
    </Card>
  );
};

export default RequestListResults;
