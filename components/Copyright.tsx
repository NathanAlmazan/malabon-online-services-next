import { Typography } from "@mui/material";

export default function Copyright() {
    return (
        <footer>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ m: 7 }}>
                {'Copyright © '}
                CITY GOVERNMENT OF MALABON
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </footer>
    );
}