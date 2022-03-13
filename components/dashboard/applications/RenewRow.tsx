import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DraftsIcon from '@mui/icons-material/Drafts';
import Stack from '@mui/material/Stack';
import { useRouter } from "next/router";
import GradingIcon from '@mui/icons-material/Grading';
import { SeverityPill } from "../../dashboard/SeverityPill";

type RowData = {
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

interface Props {
    labelId: string;
    row: RowData;
    isItemSelected: boolean;
    handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, name: string) => void;
}

const getMessage = (value: boolean): string => {
  if (!value) return "Waiting for tax order of payment.";
  else return "Your application is waiting for payment.";
}

function ApplicationRow(props: Props) {
    const { row, isItemSelected, handleClick, labelId } = props;
    const router = useRouter();
    
  return (
    <TableRow
        hover
        sx={{ height: 80 }}
    >
        <TableCell padding="checkbox">
        <Checkbox
            color="primary"
            onClick={(event) => handleClick(event, row.renewalId.toString())}
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
                {row.businessName ? row.businessName : row.business.businessName}
              </Typography>
        </TableCell>
        <TableCell>
            <SeverityPill color='warning'>
              <Typography variant="body1">
                Renew
              </Typography>
            </SeverityPill>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" sx={{ fontWeight: 400, color: 'secondary.main', fontStyle: 'italic', maxWidth: 500 }} noWrap>
            {getMessage(Boolean(row.topFile != null))}
          </Typography>
        </TableCell>
        <TableCell align="right">{new Date(row.renewAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
        <TableCell align="right">
          <Stack direction="row">
            <IconButton disabled>
              <Tooltip title="View Assessment">
                <GradingIcon />
              </Tooltip>
            </IconButton>
            <IconButton disabled={Boolean(row.topFile == null)} onClick={() => router.push('/dashboard/business/renew/payment/' + row.renewalId)}>
              <Tooltip title="Go to Form">
                <DraftsIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </TableCell>
    </TableRow>
  )
}

export default ApplicationRow