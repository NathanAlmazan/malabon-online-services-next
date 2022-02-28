import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type BusinessApproval = {
  approved: boolean;
  approvalType: string;
  approvedAt: Date;
  required: boolean;
  approvalFee: number | null;
  official: {
      firstName: string;
      lastName: string;
  }
}

interface Props {
    open: boolean;
    handleClose: () => void;
    approvals: BusinessApproval[];
    addAssessment: () => void;

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

export default function MapDialog(props: Props) {
    const { open, handleClose, addAssessment, approvals } = props;
    const clearance = ["PZO", "OLBO", "CHO", "CENRO", "OCMA", "BFP"];
    const approved = approvals.map(app => app.approvalType);

  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Business Assessments
        </BootstrapDialogTitle>
        <DialogContent dividers>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>DESCRIPTION</TableCell>
                  <TableCell align="right">COMPLIANCE</TableCell>
                  <TableCell align="right">FEE</TableCell>
                  <TableCell align="right">OFFICER</TableCell>
                  <TableCell align="right">DATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvals.map((row) => (
                  <TableRow
                    hover
                    key={row.approvalType}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {getTitle(row.approvalType)}
                    </TableCell>
                    <TableCell align="right">{getResult(row.approved, row.required)}</TableCell>
                    <TableCell align="right">{row.approvalFee}</TableCell>
                    <TableCell align="right">{row.official.firstName + ' ' + row.official.lastName}</TableCell>
                    <TableCell align="right">{new Date(row.approvedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                  </TableRow>
                ))}
                 {clearance.map(row => {
                  const exists = approved.includes(row);

                  if (!exists) return (
                    <TableRow
                      hover
                      key={row}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {getTitle(row)}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={addAssessment}>
            Add Assessment
          </Button>
        </DialogActions>
      </BootstrapDialog>
  );
}
