import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { BusinessTypes } from '.';
import { capitalCase } from 'change-case';

interface Props {
    businessTypes: BusinessTypes[];
    selectedBusiness: BusinessTypes | null;
    error: boolean;
    onSelect: (businessType: BusinessTypes) => void;
}

function ZoningBusiness({ businessTypes, selectedBusiness, error, onSelect }: Props) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredList, setFilteredList] = useState<BusinessTypes[]>([]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    useEffect(() => {
        if (searchQuery.length == 0) {
            setFilteredList(businessTypes);
        } else {
            const filtered = businessTypes.filter(business => business.typeName.includes(searchQuery));
            setFilteredList(filtered);
        }
    }, [searchQuery, businessTypes])

  return (
      <Box>
           <Box sx={{ width: { xs: '100%', sm: 400, md: 500 }, mb: 2 }}>
                <TextField
                    margin="normal"
                    variant="outlined"
                    required
                    fullWidth
                    name="businessSearch"
                    placeholder="Search business type"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    error={error}
                    helperText={error ? "Please select your business type first." : null}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                    }}
                />
            </Box>

            <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', p: 2, bgcolor: theme.palette.secondary.light }}>
                {filteredList.sort((a, b) => a.typeName.localeCompare(b.typeName)).map(businessType => {
                    const typeId = selectedBusiness != null ? selectedBusiness.typeId : 0;
                    const selected = Boolean(typeId == businessType.typeId);

                    return (
                        <Grid item xs={12} sm={6} md={4} key={businessType.typeId}>
                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                    transition: { duration: 0.5 }
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onSelect(businessType)}
                            >
                                <Paper 
                                    elevation={18} 
                                    sx={selected ? 
                                        { p: 2, backgroundColor: theme.palette.primary.main, color: '#FFFF', cursor: "pointer" } :
                                        { p: 2, border: `1px solid ${theme.palette.primary.light}`, cursor: "pointer" }}
                                >
                                    {`${capitalCase(businessType.typeName)} ${businessType.approved ? "*" : ""}`}
                                </Paper>
                            </motion.div>
                        </Grid>
                    )
                })}
            </Grid>
            {filteredList.length == 0 && (
                <Typography 
                    variant="body1" 
                    color="secondary" 
                    component="div"
                    align='center'
                    sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 100
                        }}
                >
                    No Business Type Available. Please place your business address first.
                </Typography>
            )}
      </Box>
  )
}

export default ZoningBusiness;
