import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DraftsIcon from '@mui/icons-material/Drafts';
import Stack from '@mui/material/Stack';
import { useRouter } from "next/router";
import GradingIcon from '@mui/icons-material/Grading';

type RowData = {
  businessId: number;
  businessName: string;
  submittedAt: Date;
  TIN: string;
  registrationNumber: string;
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
  
function getTitle(role: string) {
  switch(role) {
    case "OLBO": 
      return "Occupancy Permit";
    case "CHO":
      return "Sanitary Permit";
    case "CENRO":
      return "City Environmental Certificate";
    case "OCMA":
      return "Market Clearance";
    case "BFP":
      return "Fire Safety Inspection Certificate";
    default:
      return "Zoning Clearance";
  }
}

function getResult(approved: boolean, required: boolean) {
  if (!required) {
    return "Not Required";
  }
 
  return approved ? "Approved" : "Disapprove";
}

interface Props {
    labelId: string;
    row: RowData;
    isItemSelected: boolean;
    handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => void;
}

const getMessage = (value: number): string => {
  if (value == 0) return "Waiting for the assessor to review your business application";
  else if (value < 6) return "Your application is waiting for " + (6 - value) + " more assessment.";
  else return "Your business application is completely assessed. Please check your Tax Order of Payment to proceed."
}

function ApplicationRow(props: Props) {
    const { row, isItemSelected, handleClick, labelId } = props;
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    
  return (
    <>
        <TableRow
            hover
            sx={{ height: 80 }}
        >
            <TableCell padding="checkbox">
            <Checkbox
                color="primary"
                onClick={(event) => handleClick(event, row.TIN)}
                checked={isItemSelected}
                inputProps={{
                'aria-labelledby': labelId,
                }}
            />
            </TableCell>
            <TableCell
                component="th"
                id={labelId}
                scope="row"
                >
                  <Typography variant="body1" sx={{ fontWeight: 620 }}>
                    {row.businessName}
                  </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" sx={{ fontWeight: 400 }}>
                {"New Business"}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'secondary.main', fontStyle: 'italic', maxWidth: 500 }} noWrap>
                {getMessage(row.approvals.length)}
              </Typography>
            </TableCell>
            <TableCell align="right">{new Date(row.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
            <TableCell align="right">
              <Stack direction="row">
                <IconButton onClick={(event) => setOpen(!open)}>
                  <Tooltip title="View Assessment">
                    <GradingIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => router.push('/dashboard/business/new/assessment/' + row.businessId)}>
                  <Tooltip title="Go to Form">
                    <DraftsIcon />
                  </Tooltip>
                </IconButton>
              </Stack>
            </TableCell>
        </TableRow>
        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {row.approvals.length == 0 ? (
                <Typography variant="body1" gutterBottom component="div">
                  No assessment currently available.
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom component="div">
                    Assessments
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>DESCRIPTION</TableCell>
                        <TableCell>COMPLIANCE</TableCell>
                        <TableCell>OFFICER</TableCell>
                        <TableCell>DATE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.approvals.map((approval) => (
                        <TableRow key={approval.approvalType}>
                          <TableCell component="th" scope="row">
                            {getTitle(approval.approvalType)}
                          </TableCell>
                          <TableCell>{getResult(approval.approved, approval.required)}</TableCell>
                          <TableCell>{approval.official.firstName + " " + approval.official.lastName}</TableCell>
                          <TableCell>
                            {new Date(approval.approvedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
        </TableRow>
    </>
  )
}

export default ApplicationRow