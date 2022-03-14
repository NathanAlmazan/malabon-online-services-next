import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardHeader,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  CircularProgress  
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Image from 'next/image';
import CircularProgressWithLabel from "../StyledCircularProgress";

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
  viewAll: () => void;
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

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

const LatestRequest = ({ forms, viewAll }: Props) => (
  <Card>
    <CardHeader title="New Business Requests" />
    <TableContainer>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Business Name
                </TableCell>
                <TableCell>
                 Tax Identification Number
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
              {forms.slice(0, 5).map((form) => {
                const businessLocation = form.addresses.find(address => !address.mainOffice);
                const location = businessLocation ? businessLocation.bldgNumber + ' ' + businessLocation.street + ' ' + businessLocation.barangay : '';

                return (
                <TableRow
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
                        sx={{ mr: 2, bgcolor: '#E91E63' }}
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
                    <CircularProgressWithLabel value={(form.approvals.length / 6) * 100} />
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon fontSize="small" />}
        onClick={viewAll}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box>
  </Card>
);

export default LatestRequest;