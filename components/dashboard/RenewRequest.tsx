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
  Typography,
  CircularProgress  
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Image from 'next/image';
import { SeverityPill } from './SeverityPill';

interface Props {
  viewAll: () => void;
  forms: {
    business: {
      businessId: number;
      businessName: string;
      TIN: string;
      certificateId: string;
    },
    renewalId: number;
    businessId: number | null;
    permitNumber: string | null;
    receiptNumber: string | null;
    renewAt: Date;
    completed: boolean;
    businessName: string | null;
    certificateFile: string | null;
  }[];
}

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

const LatestRequest = ({ forms, viewAll }: Props) => (
  <Card>
    <CardHeader title="Renew Business Requests" />
    <TableContainer>
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
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.slice(0, 5).map((form) => {

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
                    <SeverityPill color={form.certificateFile ? 'success' : 'warning'}>
                      {form.certificateFile ? 'Release' : 'Assessing'}
                    </SeverityPill>
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