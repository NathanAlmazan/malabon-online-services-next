import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Head from "next/head";
import Typography from "@mui/material/Typography";
import LogoCard from "../components/LogoCard";

const styles = {
    headings: {
      paddingBottom: "1rem",
      fontWeight: "bold",
      height: "100%",
    },
    layout: {
      padding: "2rem 1.5rem",
    },
  };
  
  function TermsAndConditions() {
    return (
      <>
        {/* HEADER: LOGO */}
        <Head>
          <title>
              Terms and Conditions | Malabon City Online Services
          </title>
        </Head>
  
        {/* MAIN CONTENT */}
        <Container>
          <header className="TermsAndConditions-header">
            <LogoCard />
          </header>
          <Grid container>
            {/* TERMS OF SERVICE */}
            <Grid item className="Terms" mt={{ xs: 13, sm: 17 }}>
              <section>
                {/* Layout Spacing */}
                <Container style={styles.layout}>
                  {/* Title */}
                  <Grid container>
                    <Grid item md={4}>
                      <Typography
                        variant="h5"
                        color="primary"
                        style={styles.headings}
                        sx={{
                          marginRight: {
                            xs: "0",
                            md: "2rem",
                            lg: "0.7rem",
                          },
                          borderRight: {
                            xs: "0 solid black",
                            md: "5px solid #E91E63",
                          },
                        }}
                      >
                        Terms and Conditions
                      </Typography>
                    </Grid>
  
                    {/* Body */}
                    {/* prettier-ignore */}
                    <Grid item md={8}>
                    <Typography
                      variant="subtitle1" component="p" sx={{paddingLeft: {xs:0, lg: 1.5}}}>
                      1. The information provided is certified as TRUE and CORRECT.
                      {<br></br>}
                      2. Registrant should validate their account by clicking the CONFIRMATION LINK sent to the supplied email address.
                      {<br></br>}
                      3. Registrant should not create multiple FALSE ACCOUNTS.
                      {<br></br>}
                      4. Registrant should keep their account credentials and will NOT SHARE to anyone.
                    </Typography>
                    </Grid>
                  </Grid>
                </Container>
              </section>
            </Grid>
  
            {/* ACCEPTANCE OF TERMS */}
            <Grid item className="Accept">
              <section>
                {/* Layout Spacing */}
                <Container style={styles.layout}>
                  {/* Title */}
                  <Grid container>
                    <Grid item md={4}>
                      <Typography
                        variant="h5"
                        color="primary"
                        style={styles.headings}
                        sx={{
                          marginRight: { xs: "0", md: "2rem" },
                          borderRight: {
                            xs: "0 solid black",
                            md: "5px solid #E91E63",
                          },
                        }}
                      >
                        Acceptance of Terms
                      </Typography>
                    </Grid>
  
                    {/* Body */}
                    <Grid item md={8}>
                      <Typography variant="subtitle1" component="p">
                        I understand and concur that by signing up, I am agreeing
                        to the Privacy Notice and give my full consent to City
                        Government of Malabon and its affiliates as well as its
                        partners and service providers, if any, to collect, store,
                        access and/or process any personal data I may provide
                        herein, such as but not limited to my name, address,
                        telephone number and e-mail address for the period allowed
                        under the applicable law and regulations for the purpose
                        of processing my online application or request.
                        {<br></br>}
                        {<br></br>}I acknowledge that the collection and
                        processing of my personal data is necessary for such
                        purpose. I also express my consent for the verification
                        and validation of the information I have submitted related
                        to my online application or request. I am aware of my
                        right to be informed, to access, to object, to erasure or
                        blocking, to damages, to file a complaint, to rectify and
                        to data portability, and I understand that there are
                        procedures, conditions and exceptions to be complied with
                        in order to exercise or invoke such rights.
                      </Typography>
                    </Grid>
                  </Grid>
                </Container>
              </section>
            </Grid>
  
            {/* DATA PRIVACY */}
            <Grid item className="DataPrivacy">
              <section>
                {/* Layout Spacing */}
                <Container style={styles.layout}>
                  {/* Title */}
                  <Grid container>
                    <Grid item md={4}>
                      <Typography
                        variant="h5"
                        color="primary"
                        style={styles.headings}
                        sx={{
                          marginRight: { xs: "0", md: "2rem" },
                          borderRight: {
                            xs: "0 solid black",
                            md: "5px solid #E91E63",
                          },
                        }}
                      >
                        Data Privacy
                      </Typography>
                    </Grid>
  
                    {/* Body */}
                    <Grid item md={8}>
                      <Typography variant="subtitle1" component="p">
                        I hereby agree that all Personal Data (as defined under
                        the Data Privacy Law of 2012 and its implementing rules
                        and regulations), customer data and account or transaction
                        information or records (collectively, the information)
                        which may be with City Government from time to time
                        relating to us may be processed, profiled or shared to
                        requesting parties or for the purpose of any court, legal
                        process, examination, inquiry, audit or investigation of
                        any Authority. The aforesaid terms shall apply
                        notwithstanding any applicable non-disclosure agreement.
                        We acknowledge that such information may be processed or
                        profiled by or shared with jurisdictions which do not have
                        strict data protection or data privacy laws.
                      </Typography>
                    </Grid>
                  </Grid>
                </Container>
              </section>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
  
  export default TermsAndConditions;