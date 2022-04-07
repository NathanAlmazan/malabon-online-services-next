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
import { SeverityPill } from '../../dashboard/SeverityPill';
import Image from 'next/image';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import { SubmittedForm } from "../buildingTypes";

const ClaimDialog = dynamic(() => import("./ClaimDialog"));

const getInitials = (name = '') => name
  .replace(/\s+/, ' ')
  .split(' ')
  .slice(0, 2)
  .map((v) => v && v[0].toUpperCase())
  .join('');
  
  interface Props {
    searchValue: string;
    forms: SubmittedForm[];
  }

const RequestListResults = (props: Props) => {
  const { forms, searchValue } = props;
  const router = useRouter();
  const theme = useTheme();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [updatedForms, setUpdatedForms] = useState(forms);

  useEffect(() => {
    setUpdatedForms(state => forms.filter(form => form.buildingId.toString().search(searchValue)));
  }, [forms, searchValue]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, buildingId: number, approved: boolean) => {
    if (approved) {
      setCurrentId(buildingId);
      setOpen(true);
    } else {
      router.push('/admin/building/' + buildingId);
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
                     Building ID
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
              {updatedForms.slice(page * limit, page * limit + limit).map((form) => {
                const buildingOwner = form.givenName + ' ' + form.surname;

                return (
                <TableRow
                  key={form.buildingId}
                  hover
                  onClick={(event) => handleRowClick(event, form.buildingId, form.approved)}
                  sx={{ cursor: "pointer" }}
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
                    {'0000' + form.buildingId}
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
                      {form.approved ? 'Release' : 'Assess'}
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
        handleClose={() => setOpen(false)}
        buildingId={currentId}
      />
    </Card>
  );
};

export default RequestListResults;
