import React, { useEffect, useState } from 'react';
import Head from "next/head";
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Grid";
import Stack from '@mui/material/Stack';
import Image from "next/image";
import Button from '@mui/material/Button';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import { SeverityPill } from "../../components/dashboard/SeverityPill";
import DraftsIcon from '@mui/icons-material/Drafts';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';
import { SubmittedForm } from "../../components/building/buildingTypes";
import { RealEstate } from '../../components/realEstate/realEstateTypes';
import { useRouter } from 'next/router';

const AssessmentProgress = dynamic(() => import("../../components/business/client/assessments"));
const BuildingAssessment = dynamic(() => import("../../components/building/assessment"));
const InboxMenu = dynamic(() => import("../../components/dashboard/applications/InboxMenu"));
const Copyright = dynamic(() => import("../../components/Copyright"));

type Payments = {
  paid: boolean;
}

type RowData = {
  businessId: number;
  businessName: string;
  submittedAt: Date;
  TIN: string;
  registrationNumber: string;
  certificateId: string | null;
  approved: boolean;
  approvals: RowApproval[];
  payments: Payments[];
}

type RowApproval = {
  approvalType: string;
  approved: boolean;
  required: boolean;
  approvalFee: number;
  approvedAt: Date;
  remarks: string | null;
  official: {
    firstName: string;
    lastName: string;
  }
}

type RenewData = {
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
    payments: Payments[];
}


type Filter = "assessment" | "approved" | "new" | "renew" | "building" | "all" | "unpaid" | "estate";

interface Props {
  accessToken: string;
  applications: RowData[];
  renew: RenewData[];
  building: SubmittedForm[];
  realEstate: RealEstate[];
}

export default function UserApplications({ accessToken, applications, renew, building, realEstate }: Props) {
  const router = useRouter();
  const [newBusiness, setNewBusiness] = useState<RowData[]>(applications);
  const [renewBusiness, setRenewBusiness] = useState<RenewData[]>(renew);
  const [buildingApps, setBusinessApps] = useState<SubmittedForm[]>(building);
  const [estateReqs, setEstateReqs] = useState<RealEstate[]>(realEstate);
  const [selectedBusiness, setSelectedBusiness] = useState<RowData | null>(applications[0]);
  const [selectedRenewal, setSelectedRenewal] = useState<RenewData | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<SubmittedForm | null>(null);
  const [selectedEstate, setSelectedEstate] = useState<RealEstate | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (filter == "all") {
      setNewBusiness(state => applications);
      setRenewBusiness(state => renew);
      setBusinessApps(state => building);
      setEstateReqs(state => realEstate);
    } else if (filter == "assessment") {
      setNewBusiness(state => applications.filter(form => !form.approved));
      setRenewBusiness(state => renew.filter(form => !form.completed));
      setBusinessApps(state => building.filter(form => !form.approved));
      setEstateReqs(state => realEstate.filter(form => !form.completed));
    } else if (filter == "approved") {
      setNewBusiness(state => applications.filter(form => form.approved));
      setRenewBusiness(state => renew.filter(form => form.completed));
      setBusinessApps(state => building.filter(form => form.approved));
      setEstateReqs(state => realEstate.filter(form => form.completed));
    } else if (filter == "new") {
      setNewBusiness(state => applications);
      setRenewBusiness(state => []);
      setBusinessApps(state => []);
      setEstateReqs(state => []);
    } else if (filter == "renew") {
      setNewBusiness(state => []);
      setRenewBusiness(state => renew);
      setBusinessApps(state => []);
      setEstateReqs(state => []);
    } else if (filter == "building") {
      setNewBusiness(state => []);
      setRenewBusiness(state => []);
      setBusinessApps(state => building);
      setEstateReqs(state => []);
    } else if (filter == "estate") {
      setNewBusiness(state => []);
      setRenewBusiness(state => []);
      setBusinessApps(state => []);
      setEstateReqs(state => realEstate);
    } else if (filter == "unpaid") {
      setNewBusiness(state => applications.filter(app => app.payments.find(payment => !payment.paid)));
      setRenewBusiness(state => renew.filter(app => app.payments.find(payment => !payment.paid)));
      setBusinessApps(state => building.filter(app => app.payments.find(payment => !payment.paid)));
      setEstateReqs(state => realEstate.filter(app => app.payments.find(payment => !payment.paid)));
    }
  }, [filter, applications, renew, building, realEstate]);


  const handleSelectBusiness = (selected: RowData) => {
    setSelectedBusiness(selected);
    setSelectedRenewal(null);
    setSelectedBuilding(null);
    setSelectedEstate(null);
  }

  const handleSelectRenew = (renew: RenewData) => {
    setSelectedRenewal(renew);
    setSelectedBusiness(null);
    setSelectedBuilding(null);
    setSelectedEstate(null);
  }

  const handleSlectBuilding = (building: SubmittedForm) => {
    setSelectedBuilding(building);
    setSelectedRenewal(null);
    setSelectedBusiness(null);
    setSelectedEstate(null);
  }

  const handleSelectRealEstate = (estate: RealEstate) => {
    setSelectedEstate(estate);
    setSelectedBuilding(null);
    setSelectedRenewal(null);
    setSelectedBusiness(null);
  }

  return (
    <>
        <Head>
            <title>Inbox | Malabon Online Services</title>
        </Head>
        <Container>
            <Paper sx={{ width: '100%', mt: 3, p: 3, minHeight: '60vh' }}>
              <Stack direction="row" sx={{ mb: 2 }} justifyContent="space-between">
                  <Typography component="h1" variant="h4" textAlign="left">
                      Requests <strong style={{ color: "primary.main" }}>Inbox</strong>
                  </Typography>
                  <InboxMenu 
                    filter={filter}
                    selectFilter={(value) => setFilter(value)}
                  />
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
                  <List sx={{ overflowY: 'auto', maxHeight: '58vh' }}>
                    {newBusiness.map(form => {
                      const fulfiled = form.approved;
                      const rejected = form.approvals.find(approval => !approval.approved && approval.required);
                      const isSelected = Boolean(selectedBusiness != null && selectedBusiness.businessId == form.businessId);

                      return (
                        <ListItemButton key={form.businessId} onClick={() => handleSelectBusiness(form)} selected={isSelected}>
                            <ListItemText
                              primary={<h3>{form.businessName}</h3>}
                              secondary={
                                <p>{`New Business Application — ${fulfiled ? "Your application is now ready to claim." : rejected ? "Sorry, your application is rejected. Please open the form for details" : "Your application is currently being assessed. Please patiently wait for the result. You can regularly check the progress by opening your form."}`}
                                  <br/>
                                  {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                              }
                            />  
                            <Box sx={{ ml: 2 }}>
                              <SeverityPill color={fulfiled ? "success" : rejected ? "error" : "warning"}>
                                {fulfiled ? "Fulfilled" : rejected ? "Rejected" : "Assessing"}
                              </SeverityPill>
                            </Box>
                        </ListItemButton>
                      )

                    })}
                    {renewBusiness.map(form => {
                      const fulfiled = form.completed;
                      const isSelected = Boolean(selectedRenewal != null && selectedRenewal.renewalId == form.renewalId);
                      
                      return (
                        <ListItemButton key={form.renewalId} onClick={() => handleSelectRenew(form)} selected={isSelected}>
                            <ListItemText
                              primary={<h3>{form.businessName ? form.businessName : form.business.businessName}</h3>}
                              secondary={
                                <p>{`Business Renewal Application — ${fulfiled ? "Your application is now ready to claim." : "Your application is currently being assessed. Please patiently wait for the result."}`}
                                  <br/>
                                  {new Date(form.renewAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                              }
                            />  
                            <Box sx={{ ml: 2 }}>
                              <SeverityPill color={fulfiled ? "success" : "warning"}>
                                {fulfiled ? "Fulfilled" : "Assessing"}
                              </SeverityPill>
                            </Box>
                        </ListItemButton>
                      )
                    })}
                    {buildingApps.map((form => {
                      const fulfiled = form.approved;
                      const rejected = form.approvals.find(approval => !approval.approved && approval.required);
                      const isSelected = Boolean(selectedBuilding != null && selectedBuilding.buildingId == form.buildingId);

                      return (
                        <ListItemButton key={form.buildingId} onClick={() => handleSlectBuilding(form)} selected={isSelected}>
                          <ListItemText
                            primary={<h3>{form.buildingUse}</h3>}
                            secondary={
                              <p>{`Building Permit Application — ${fulfiled ? "Your application is now ready to claim." : rejected ? "Sorry, your application is rejected. Please open the form for details" : "Your application is currently being assessed. Please patiently wait for the result. You can regularly check the progress by opening your form."}`}
                                <br/>
                                {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            }
                          />  
                          <Box sx={{ ml: 2 }}>
                            <SeverityPill color={fulfiled ? "success" : rejected ? "error" : "warning"}>
                              {fulfiled ? "Fulfilled" : rejected ? "Rejected" : "Assessing"}
                            </SeverityPill>
                          </Box>
                      </ListItemButton>
                      )
                    }))}
                    {realEstate.map(form => {
                      const fulfiled = form.completed;
                      const isSelected = Boolean(selectedEstate != null && selectedEstate.estateId == form.estateId);
                      
                      return (
                        <ListItemButton key={form.estateId} onClick={() => handleSelectRealEstate(form)} selected={isSelected}>
                            <ListItemText
                              primary={<h3>{form.declarationNum}</h3>}
                              secondary={
                                <p>{`Real Estate Tax — ${fulfiled ? "Your receipt is now ready to claim." : "Your request is currently being assessed. Please patiently wait for the result."}`}
                                  <br/>
                                  {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                              }
                            />  
                            <Box sx={{ ml: 2 }}>
                              <SeverityPill color={fulfiled ? "success" : "warning"}>
                                {fulfiled ? "Fulfilled" : "Assessing"}
                              </SeverityPill>
                            </Box>
                        </ListItemButton>
                      )
                    })}
                  </List>
                </Grid>
                <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }}>
                  {selectedBusiness != null && (
                    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '58vh', p: 2 }}>
                      <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="h5">{selectedBusiness.businessName}</Typography>
                            <Typography variant="body1">{new Date(selectedBusiness.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                          </Box>
                          <IconButton onClick={() => router.push('/dashboard/business/new/assessment/' + selectedBusiness.businessId)}>
                            <DraftsIcon fontSize="large" color="primary" />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {selectedBusiness.approved ? (
                          <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                          }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                {filter == "unpaid" ? "This request have on going payment. Please click the button below to see payment instructions. Thank you!" : "Congratulations! Your new business is now registered. Please click the button bellow to see the date and time when you can claim your business permit."}
                            </Typography>
                            <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push(filter == "unpaid" ? '/dashboard/business/new/payment/' + selectedBusiness.businessId : '/dashboard/business/new/claim/' + selectedBusiness.businessId)}>
                              {filter == "unpaid" ? "Tax Payment" : "Claim Business Permit"}
                            </Button>
                          </Box>
                        ) : (
                          <AssessmentProgress approvals={selectedBusiness.approvals} businessId={selectedBusiness.businessId} inbox={true} /> 
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {Boolean(applications.length == 0 && renew.length == 0 && building.length == 0 && realEstate.length == 0) && (
                    <Box sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      padding: 2
                    }}>
                      <Image 
                          src="/icons/mail_icon.png"
                          alt='cover image'
                          width={400}
                          height={400}
                      />
                      <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350, mt: 3 }}>
                          You have no existing request at the moment. Please go to home page and select transaction.
                      </Typography>
                      <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push('/dashboard')}>
                          Go to Home Page
                      </Button>
                    </Box>
                  )}
                  {selectedRenewal != null && (
                    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '58vh', p: 2 }}>
                      <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="h5">{selectedRenewal.businessName ? selectedRenewal.businessName : selectedRenewal.business.businessName}</Typography>
                            <Typography variant="body1">{new Date(selectedRenewal.renewAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                          </Box>
                          <IconButton onClick={() => router.push('/dashboard/business/renew/payment/' + selectedRenewal.renewalId)} disabled={Boolean(selectedRenewal.topFile != null)}>
                            <DraftsIcon fontSize="large" color="primary" />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {selectedRenewal.completed ? (
                          <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                          }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                {filter == "unpaid" ? "This request have on going payment. Please click the button below to see payment instructions. Thank you!" : "Congratulations! Your business is renewed successfully. Please click the button below to see the date and time when you can claim your new business permit."}
                            </Typography>
                            <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push(filter == "unpaid" ? '/dashboard/business/renew/payment/' + selectedRenewal.renewalId : '/dashboard/business/renew/claim/' + selectedRenewal.renewalId)}>
                                {filter == "unpaid" ? "Tax Payment" : "Claim Business Permit"}
                            </Button>
                          </Box>
                        ) : (
                          selectedRenewal.topFile != null ? (
                            <Box sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              padding: 2
                            }}>
                              <Image 
                                  src="/icons/claim_icon.png"
                                  alt='cover image'
                                  width={400}
                                  height={400}
                              />
                              <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                  {"Your request was approved. Please click the button below to pay tax order of payment."}
                              </Typography>
                              <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push('/dashboard/business/renew/payment/' + selectedRenewal.renewalId)}>
                                  {"Tax Payment"}
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              padding: 2
                            }}>
                              <Image 
                                  src="/icons/assess_icon.png"
                                  alt='cover image'
                                  width={300}
                                  height={300}
                              />
                              <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350, mt: 3 }}>
                                  Your business renewal is currently being assessed. Thank you for your patience.
                              </Typography>
                            </Box>
                          )
                         
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {selectedBuilding != null && (
                    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '58vh', p: 2 }}>
                      <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="h5">{selectedBuilding.buildingUse}</Typography>
                            <Typography variant="body1">{new Date(selectedBuilding.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                          </Box>
                          <IconButton onClick={() => router.push('/dashboard/building/assessment/' + selectedBuilding.buildingId)}>
                            <DraftsIcon fontSize="large" color="primary" />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {selectedBuilding.approved ? (
                          <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                          }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                            {filter == "unpaid" ? "This request have on going payment. Please click the button below to see payment instructions. Thank you!" : "Congratulations! Your building/establishment is now registered. Please click the button below to see the date and time when you can claim your building permit."}
                            </Typography>
                            <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push(filter == "unpaid" ? '/dashboard/building/payment/' + selectedBuilding.buildingId : '/dashboard/building/claim/' + selectedBuilding.buildingId)}>
                              {filter == "unpaid" ? "Tax Payment" : "Claim Building Permit"}
                            </Button>
                          </Box>
                        ) : (
                          <BuildingAssessment approvals={selectedBuilding.approvals} buildingId={selectedBuilding.buildingId} inbox={true} /> 
                        )}
                      </Grid>
                    </Grid>
                  )}
                   {selectedEstate != null && (
                    <Grid container spacing={2} sx={{ overflowY: 'auto', maxHeight: '58vh', p: 2 }}>
                      <Grid item xs={12} md={12}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="h5">{selectedEstate.declarationNum}</Typography>
                            <Typography variant="body1">{new Date(selectedEstate.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                          </Box>
                          <IconButton onClick={() => router.push('/dashboard/business/renew/payment/' + selectedEstate.estateId)} disabled={Boolean(selectedEstate.topFile != null)}>
                            <DraftsIcon fontSize="large" color="primary" />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        {selectedEstate.completed ? (
                          <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                          }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                {filter == "unpaid" ? "This request have on going payment. Please click the button below to see payment instructions. Thank you!" : "Congratulations! Your real estate tax is paid successfully. Please click the button below to see the date and time when you can claim your receipt."}
                            </Typography>
                            <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push(filter == "unpaid" ? '/dashboard/estate/payment/' + selectedEstate.estateId : '/dashboard/estate/claim/' + selectedEstate.estateId)}>
                                {filter == "unpaid" ? "Tax Payment" : "Claim Real Estate Receipt"}
                            </Button>
                          </Box>
                        ) : (
                          selectedEstate.topFile != null ? (
                            <Box sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              padding: 2
                            }}>
                              <Image 
                                  src="/icons/claim_icon.png"
                                  alt='cover image'
                                  width={400}
                                  height={400}
                              />
                              <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                  {"Your request was approved. Please click the button below to pay tax order of payment."}
                              </Typography>
                              <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => router.push('/dashboard/estate/payment/' + selectedEstate.estateId)}>
                                  {"Tax Payment"}
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              padding: 2
                            }}>
                              <Image 
                                  src="/icons/assess_icon.png"
                                  alt='cover image'
                                  width={300}
                                  height={300}
                              />
                              <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350, mt: 3 }}>
                                  Your real estate payment request is currently being assessed. Thank you for your patience.
                              </Typography>
                            </Box>
                          )
                        )}
                      </Grid>
                    </Grid>
                  )}
                  </Grid>
              </Grid>
            </Paper>

            <Copyright />
        </Container>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const data = parseCookies(req);

  if (Object.keys(data).length === 0 && data.constructor === Object) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin"
      }
    }
  }

  const result = await apiGetRequest('/business/new/applications', data.loggedInUser);
  const renew = await apiGetRequest('/business/renew/myRequests', data.loggedInUser);
  const building = await apiGetRequest('/building/user/requests', data.loggedInUser);
  const realEstate = await apiGetRequest('/estate/requests', data.loggedInUser);

  if (result.status > 300) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      accessToken: data.loggedInUser,
      applications: result.data,
      renew: renew.data,
      building: building.data,
      realEstate: realEstate.data
    }
  }
}
