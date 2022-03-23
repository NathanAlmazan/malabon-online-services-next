import React from 'react';
import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import NumbersIcon from '@mui/icons-material/Numbers';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  }
}));

interface Props {
  submitAssessment: () => void;
  openTrackDialog: () => void;
  openTaxDialog: () => void;
  approvalTable: () => void;
  goBack: () => void;
  trackNum: boolean;
  approvals: number;
  roles: string[];
}

export default function SpeedAction(props: Props) {
  const { submitAssessment, openTrackDialog, openTaxDialog, approvalTable, goBack, roles, approvals, trackNum } = props;

  return (
    <StyledSpeedDial
        ariaLabel="Assess"
        icon={<SpeedDialIcon openIcon={<EditIcon />} icon={<RateReviewIcon />} />}
    >
      <SpeedDialAction
          icon={<LibraryAddCheckIcon />}
          tooltipTitle={'View Registration Approvals'}
          onClick={approvalTable}
      />

      {approvals < 9 && (
        <SpeedDialAction
          icon={<FindInPageIcon />}
          tooltipTitle={'Submit Assessment'}
          onClick={submitAssessment}
        />
      )}
      
      {Boolean(roles.includes("BFP") && !trackNum) && (
        <SpeedDialAction
          icon={<NumbersIcon />}
          tooltipTitle={'Assign Tracking Number'}
          onClick={openTrackDialog}
        />
      )}

      {Boolean(roles.includes("TRSY") &&  approvals >= 9) && (
        <SpeedDialAction
          icon={<ReceiptIcon />}
          tooltipTitle={'Tax Order of Payment'}
          onClick={openTaxDialog}
        />
      )}
       
       <SpeedDialAction
          icon={<ExitToAppIcon />}
          tooltipTitle={'Assess Later'}
          onClick={goBack}
        />

    </StyledSpeedDial>
  );
}
