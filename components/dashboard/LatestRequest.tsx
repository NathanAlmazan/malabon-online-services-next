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
  LinearProgress 
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from './SeverityPill';

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
                  Owner Name
                </TableCell>
                <TableCell>
                  Business Name
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
                const owner = form.owners.find(owner => owner.owner);
                const ownerName = owner ? owner.givenName + ' ' + owner.surname : '';

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
                        {getInitials(ownerName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {ownerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {form.businessName}
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