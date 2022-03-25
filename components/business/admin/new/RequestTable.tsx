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
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from "next/router";
import CircularProgress from "../../../StyledCircularProgress";
import dynamic from 'next/dynamic';

const ClaimDialog = dynamic(() => import("./ClaimDialog"));

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
    fire?: boolean;
    searchValue: string;
    forms: {
      businessId: number;
      businessName: string;
      submittedAt: Date;
      approved: boolean;
      addresses: BusinessAdresses[];
      trackNumber: number | null;
      TIN: string;
      owners: BusinessOwners[];
      approvals: BusinessApproval[];
      payments: BusinessPayments[];
    }[]
  }

const RequestListResults = (props: Props) => {
  const { forms, fire, searchValue } = props;
  const router = useRouter();
  const theme = useTheme();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [updatedForms, setUpdatedForms] = useState(forms);

  useEffect(() => {
    if (fire !== undefined) {
      setUpdatedForms(state => forms.filter(form => form.trackNumber?.toString().includes(searchValue)));
    } else {
      setUpdatedForms(state => forms.filter(form => form.TIN.includes(searchValue)));
    }
  }, [forms, fire, searchValue]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleDialogClose = () => {
    setUpdatedForms(updatedForms.filter(form => form.businessId != currentId));
    setCurrentId(0);
    setOpen(false);
  }

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, businessId: number, approved: boolean) => {
    if (approved) {
      setCurrentId(businessId);
      setOpen(true);
    } else {
      router.push('/admin/business/register/' + businessId);
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
                  {fire ? "Track Number" : "TIN Number"}
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
                const businessLocation = form.addresses.find(address => !address.mainOffice);
                const location = businessLocation ? businessLocation.bldgNumber + ' ' + businessLocation.street + ' ' + businessLocation.barangay : '';

                return (
                <TableRow
                  hover
                  onClick={(event) => handleRowClick(event, form.businessId, form.approved)}
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
                    {fire ? form.trackNumber : form.TIN}
                  </TableCell>
                  <TableCell>
                    {location}
                  </TableCell>
                  <TableCell>
                    {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <CircularProgress value={(form.approvals.length / 6) * 100} color="primary" />
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
                        All New Business Forms are assessed successfully
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
      <ClaimDialog 
        open={open}
        handleClose={handleDialogClose}
        businessId={currentId}
      />
    </Card>
  );
};

export default RequestListResults;
