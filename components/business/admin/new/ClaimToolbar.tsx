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
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { useRouter } from "next/router";

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
  
  interface Props {
    forms: {
      businessId: number;
      businessName: string;
      submittedAt: Date;
      addresses: BusinessAdresses[];
      TIN: string;
      owners: BusinessOwners[];
      approvals: BusinessApproval[];
    }[]
  }

const RequestListResults = (props: Props) => {
  const { forms } = props;
  const router = useRouter();
  const theme = useTheme();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, businessId: number) => {
    router.push('/admin/business/register/' + businessId);
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
              {forms.slice(page * limit, page * limit + limit).map((form) => {
                const businessLocation = form.addresses.find(address => !address.mainOffice);
                const location = businessLocation ? businessLocation.bldgNumber + ' ' + businessLocation.street + ' ' + businessLocation.barangay : '';

                return (
                <TableRow
                  hover
                  onClick={(event) => handleRowClick(event, form.businessId)}
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
                    <LinearProgress value={(form.approvals.length / 6) * 100} variant="determinate" />
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      <TablePagination
        component="div"
        count={forms.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default RequestListResults;
