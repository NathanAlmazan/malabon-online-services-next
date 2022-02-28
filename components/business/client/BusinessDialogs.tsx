import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ZoningBusiness from './zoning/ZoningBusiness';

export interface BusinessTypes {
    typeId: number;
    typeName: string;
    zoneId: number;
}

interface Props {
    open: boolean;
    businessTypes: BusinessTypes[];
    selectedBusiness: BusinessTypes | null;
    error: boolean;
    onSelect: (businessType: BusinessTypes) => void;
    handleClose: () => void;
    handleCancel: () => void;
}

export default function AlertDialog({ open, businessTypes, selectedBusiness, error, onSelect, handleClose, handleCancel }: Props) {

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogContent>
            <ZoningBusiness 
                businessTypes={businessTypes}
                onSelect={onSelect}
                error={error}
                selectedBusiness={selectedBusiness}
            />
        </DialogContent>
        
        <DialogActions>
            <Button onClick={() => handleCancel()}>Cancel</Button>
            <Button onClick={() => handleClose()} autoFocus>
                Submit
            </Button>
        </DialogActions>
    </Dialog>
  );
}
