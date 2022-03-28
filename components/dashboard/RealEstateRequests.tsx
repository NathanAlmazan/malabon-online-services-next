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
    CircularProgress,  
    Avatar
  } from '@mui/material';
  import ArrowRightIcon from '@mui/icons-material/ArrowRight';
  import Image from 'next/image';
  import { SeverityPill } from './SeverityPill';
import { RealEstate } from '../realEstate/realEstateTypes';
  
  interface Props {
    viewAll: () => void;
    forms: RealEstate[];
  }
  
  const getInitials = (name = '') => name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');
  
  const RealEstateRequests = ({ forms, viewAll }: Props) => (
    <Card>
      <CardHeader title="Real Estate Payment Requests" />
      <TableContainer>
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
                {forms.slice(0, 5).map((form) => {
  
                  return (
                  <TableRow
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
                          All Real Estate Applications are assessed successfully
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
  
  export default RealEstateRequests;