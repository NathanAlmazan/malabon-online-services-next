import React from 'react';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
  
  
  const steps = ['Zone', 'Form', 'Assessment', 'Payment', 'Claim'];

interface Props {
  step: number;
}

function StepProgress({ step }: Props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack sx={{ width: '100%', pt: 2 }} spacing={4}>
       <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
                <Step key={label}>
                    {!matches ? (
                        <StepLabel>{label}</StepLabel>
                    ) : (
                        <StepLabel/>
                    )}
                </Step>
            ))}
        </Stepper>
  </Stack>
  );
}

export default StepProgress;
