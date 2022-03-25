import React from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { capitalCase } from "change-case";

interface AdminAccount {
    adminAccount: {
        userId: number;
        firstName: string;
        uid: string;
        lastName: string;
        officer: boolean;
        superuser: boolean;
        phoneNumber: string | null;
        gender: string;
    },
    roles: string[];
    assessed: number;
    forAssess: number;
    image?: string;
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
      case "TRSY": 
        return "Treasury";
      case "BPLO": 
        return "Release";
      case "PZO": 
        return "Zoning Clearance"
      default:
        return role;
    }
  }

function AccountCard({ account, select }: { account: AdminAccount, select: (account: AdminAccount) => void }) {
  return (
    <Card sx={{ p: 3 }} onClick={() => select(account)}>
        <Stack direction="column" spacing={3}>
            <Avatar
                alt="Remy Sharp"
                src={account.image ? account.image : "/icons/account_profile.png"}
                sx={{ width: 180, height: 180, alignSelf: 'center' }}
                
            />
            <Stack direction="column">
                <Typography
                    variant="h6"
                    align="center"
                >
                    {account.adminAccount.firstName + ' ' + account.adminAccount.lastName}
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                >
                    {capitalCase(getTitle(account.roles[0]))}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "gray" }}
                    align="center"
                >
                    {account.adminAccount.superuser ? "Superuser" : "Admin"}
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={3}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  }}>
                    {"Productivity: " + account.assessed + "%"}
                </Typography>
            </Stack>
        </Stack>
    </Card>
  )
}

export default AccountCard