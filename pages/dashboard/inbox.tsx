import React from 'react';
import Head from "next/head";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';

const EnhancedTableToolbar = dynamic(() => import("../../components/dashboard/applications/ApplicationToolbar"));
const ApplicationRow = dynamic(() => import("../../components/dashboard/applications/ApplicationRow"));
const RenewRow = dynamic(() => import("../../components/dashboard/applications/RenewRow"));
const Copyright = dynamic(() => import("../../components/Copyright"));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type RowData = {
  businessId: number;
  businessName: string;
  submittedAt: Date;
  TIN: string;
  registrationNumber: string;
  certificateId: string | null;
  approved: boolean;
  approvals: RowApproval[];
}

type RowApproval = {
  approvalType: string;
  approved: boolean;
  required: boolean;
  approvalFee: string;
  approvedAt: Date;
  official: {
    firstName: string;
    lastName: string;
  }
}

type RenewData = {
    business: {
      businessId: number;
      businessName: string;
      TIN: string;
      certificateId: string;
    },
    renewalId: number;
    businessId: number | null;
    permitNumber: string | null;
    receiptNumber: string;
    receiptFile: string | null;
    renewAt: Date;
    completed: boolean;
    businessName: string | null;
    topFile: string | null;
}


type Filter = "assessment" | "approved" | "disapproved" | "release" | "all";

interface Props {
  accessToken: string;
  applications: RowData[];
  renew: RenewData[];
}

export default function UserApplications({ accessToken, applications, renew }: Props) {
  const [filteredList, setFilteredList] = React.useState<RowData[]>([]);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [emptyRows, setEmptyRows] = React.useState<number>(0);
  const [searchValue, setSearchValue] = React.useState<string>("");

  React.useEffect(() => {
    if (filter == "approved") setFilteredList(state => applications.filter(app => app.approved)); 
    else if (filter == "assessment") setFilteredList(state => applications.filter(app => !app.approved && app.approvals.length < 6)); 
    else if (filter == "disapproved") setFilteredList(state => applications.filter(app => app.approvals.find(approved => !approved.approved && approved.required))); 
    else if (filter == "release") setFilteredList(state => applications.filter(app => app.certificateId != null)); 
    else {
      setFilteredList(state => applications);
    }
  }, [filter, applications])

  React.useEffect(() => {
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredList.length) : 0;
    setEmptyRows(state => emptyRows);
  }, [page, rowsPerPage, filteredList])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (value: Filter) => {
    setFilter(value);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  console.log(renew);

  return (
    <>
        <Head>
            <title>Inbox | Malabon Online Services</title>
        </Head>
        <Container>
            <Box sx={{ mt: 5, mb: 5 }}>
                <Typography component="h1" variant="h4" textAlign="left">
                    Requests <strong style={{ color: "primary.main" }}>Inbox</strong>
                </Typography>
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar 
                  numSelected={selected.length} 
                  selectFilter={handleFilterChange} 
                  filter={filter}
                  searchChange={handleSearchChange}
                  searchValue={searchValue}
                />
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ bgcolor: 'secondary.light' }}
                />
                <TableContainer>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                    >
                    <TableBody>
                        {filteredList
                        .filter(list => list.businessName.includes(searchValue))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            const isItemSelected = isSelected(row.TIN);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                              <ApplicationRow 
                                key={row.businessId}
                                handleClick={handleClick}
                                isItemSelected={isItemSelected}
                                labelId={labelId}
                                row={row}
                              />
                            );
                        })}
                        {renew.map((business, index) => {
                          const isItemSelected = isSelected(business.renewalId.toString());
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <RenewRow 
                              key={business.renewalId}
                              handleClick={handleClick}
                              isItemSelected={isItemSelected}
                              labelId={labelId}
                              row={business}
                            />
                          )
                        })}
                         {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (53) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </TableContainer>
                
            </Paper>

            <Copyright />
        </Container>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const data = parseCookies(req);

  if (Object.keys(data).length === 0 && data.constructor === Object) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin"
      }
    }
  }

  const result = await apiGetRequest('/business/new/applications', data.loggedInUser);
  const renew = await apiGetRequest('/business/renew/myRequests', data.loggedInUser);

  if (result.status > 300) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      accessToken: data.loggedInUser,
      applications: result.data,
      renew: renew.data
    }
  }
}
