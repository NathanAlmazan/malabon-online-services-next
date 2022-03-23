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
  Typography
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Image from 'next/image';
import { SeverityPill } from './SeverityPill';
import { SubmittedForm } from '../building/buildingTypes';

interface Props {
  viewAll: () => void;
  forms: SubmittedForm[];
}

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');

const BuildingRequests = ({ forms, viewAll }: Props) => (
  <Card>
    <CardHeader title="Building Permit Requests" />
    <TableContainer>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Building Owner
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
              </TableRow>
            </TableHead>
            <TableBody>
            {forms.slice(0, 5).map((form) => {
                const buildingOwner = form.givenName + ' ' + form.surname;

                return (
                <TableRow
                  key={form.buildingId}
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
                    <SeverityPill color={form.approved ? 'success' : 'warning'}>
                      {form.approved ? 'Release' : 'On Going'}
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
                        All Building Registration are assessed successfully
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

export default BuildingRequests;