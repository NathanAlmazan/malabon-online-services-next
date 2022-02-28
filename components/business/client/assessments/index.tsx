import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import StepConnector from '@mui/material/StepConnector';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { StepIconProps } from '@mui/material/StepIcon';
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SpaIcon from '@mui/icons-material/Spa';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    marginRight: 5,
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));
  
function OccupancyIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <CorporateFareIcon />
        </ColorlibStepIconRoot>
    );
}
function HealthIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <FavoriteIcon />
        </ColorlibStepIconRoot>
    );
}

function SanitaryIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <SpaIcon />
      </ColorlibStepIconRoot>
    );
}

function MarketIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <LocalGroceryStoreIcon />
      </ColorlibStepIconRoot>
    );
}

function FireIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <LocalFireDepartmentIcon />
      </ColorlibStepIconRoot>
    );
}

function ZoningIcon(props: StepIconProps) {
    const { active, completed, className } = props;
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        <LocationOnIcon />
      </ColorlibStepIconRoot>
    );
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

function getIcon(role: string) {
    switch(role) {
      case "OLBO": 
        return OccupancyIcon;
      case "CHO":
        return HealthIcon;
      case "CENRO":
        return SanitaryIcon;
      case "OCMA":
        return MarketIcon;
      case "BFP":
        return FireIcon;
      default:
        return ZoningIcon;
    }
}

function getResult(approved: boolean, required: boolean) {
    if (!required) {
      return "Not Required";
    }
   
    return approved ? "Approved" : "Disapprove";
  }

const clearance = ["PZO", "OLBO", "CHO", "CENRO", "OCMA", "BFP"];

type BusinessApproval = {
    approved: boolean;
    approvalType: string;
    approvedAt: Date;
    required: boolean;
    approvalFee: number | null;
    remarks: string | null;
    official: {
        firstName: string;
        lastName: string;
    }
}

interface Props {
    approvals: BusinessApproval[];
    businessId: number;
}

export default function VerticalLinearStepper(props: Props) {
  const { approvals, businessId } = props; 
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(approvals.length - 1);
  const [emptyStep, setEmptyStep] = React.useState<string[]>([]);
  const [rejected, setRejected] = React.useState<string[]>([]);

  React.useEffect(() => {
    let empty: string[] = [];
    const docMap = approvals.map(approval => approval.approvalType);
    const results = approvals.map(approval => ({ type: approval.approvalType, result: getResult(approval.approved, approval.required) }));

    setRejected(state => results.filter(result => result.result == "Disapprove").map(result => result.type));

    clearance.forEach(step => {
        if (!docMap.includes(step)) {
            empty.push(step);
        }
    })

    results.forEach

    setEmptyStep(state => empty);
  }, [approvals])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical" connector={<StepConnector sx={{ ml: 3 }} />}>
        {approvals.map((step, index) => (
          <Step key={step.approvalType}>
            <StepLabel
              StepIconComponent={getIcon(step.approvalType)}
              optional={
                index === clearance.length ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {getTitle(step.approvalType)}
            </StepLabel>
            <StepContent sx={{ ml: 3, pl: 5 }}>
              <Typography variant="subtitle1" color="secondary.main">
                {getResult(step.approved, step.required) + ". " + step.remarks}
              </Typography>
              <Typography variant="subtitle1" color="secondary.main" fontStyle="italic" sx={{ mt: 1 }}>
                — {step.official.firstName + ' ' + step.official.lastName}
              </Typography>
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    disabled={Boolean(index == approvals.length - 1 && approvals.length != clearance.length)}    
                    variant="outlined"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === clearance.length ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
        {emptyStep.map((step, index) => (
          <Step key={step}>
            <StepLabel
              StepIconComponent={getIcon(step)}
              optional={
                index === clearance.length ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {getTitle(step)}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 6 && (
        rejected.length > 0 ? (
            <Paper square variant="outlined" sx={{ p: 5, mt: 3 }}>
                <Stack direction="column" spacing={3} justifyContent="center">
                    <Typography variant="subtitle1">
                        {"Sorry you new business application did not receive " + rejected.map(reason => " " + getTitle(reason)) + ". However, you can consider the remarks left by the assessor and your form again."}
                    </Typography>
                    <Button onClick={() => setActiveStep(0)} variant="contained">
                        Review Assessment
                    </Button>
                    <Button onClick={() => handleRedirect('/dashboard/inbox')} variant="outlined" startIcon={<ArrowBackIcon />}>
                        Go Back
                    </Button>
                </Stack>
            </Paper>
        ) : (
            <Paper square variant="outlined" sx={{ p: { xs: 3, md: 5 }, mt: 3 }}>
                <Stack direction="column" spacing={3} justifyContent="center">
                    <Typography variant="subtitle1">
                        <strong style={{ color: '#E91E63', fontSize: 20 }}>Congratulations!</strong> Your new business application was approved by all of the departments. You can now proceed to the payment of tax.
                    </Typography>
                    <Button onClick={() => handleRedirect('/dashboard/business/new/payment/' + businessId)} variant="contained" endIcon={<ArrowForwardIcon />}>
                        Proceed
                    </Button>
                </Stack>
            </Paper>
        )
      )}
    </Box>
  );
}
