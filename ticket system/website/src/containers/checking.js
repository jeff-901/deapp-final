// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/album
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/copyright";
import ReturnMain from "../components/returnmain";
import MyAppBar from "../components/myapppbar";
import CheckModal from "../components/CheckModal";
import CashModal from "../components/CashModal";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Checking(props) {
  const classes = useStyles();
  const [openall, setOpenall] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  let campaigns;
  let levels;
  let seats;
  let campaigns_address;
  useEffect(async () => {
    let result = await props.methods
      .getUserTickets()
      .call({ from: props.accounts[0] });
    campaigns_address = result[0];
    levels = result[1];
    seats = result[2];
    console.log("tickets: ");
    console.log("campaign_address: ", campaigns_address);
    console.log("levels: ", levels);
    console.log("seats: ", seats);
    campaigns = await props.methods
      .getUserCampaigns()
      .call({ from: props.accounts[0] });
    console.log("campaign: ", campaigns);
  });

  campaigns = [
    {
      campaign_name: "test",
      abstraction: "testing",
      campaign_start_time: "2021-01-18",
      campaign_end_time: "2021-01-18",
      price: ["10"],
    },
  ];
  const handleCheck = () => {
    setOpen(true);
    // console.log("open");
    // let result = await props.methods
    //   .buyTicket(address, 1)
    //   .send({ from: props.accounts[0] });
    // result = result.events.OnBuyTicket.returnValues;
    // if (result[0] === "success") {
    //   alert("success");
    // } else {
    //   alert("fail");
    // }
  };
  const handleCheck1 = () => {
    setOpen1(true);
    // console.log("open");
    // let result = await props.methods
    //   .buyTicket(address, 1)
    //   .send({ from: props.accounts[0] });
    // result = result.events.OnBuyTicket.returnValues;
    // if (result[0] === "success") {
    //   alert("success");
    // } else {
    //   alert("fail");
    // }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <MyAppBar />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="m">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Your campaigns and tickets
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          {campaigns ? (
            <Grid container spacing={4}>
              {campaigns.map((campaign, index) => (
                <Grid item key={campaign} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title={campaign.campaign_name}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {campaign.campaign_name}
                      </Typography>
                      <Typography>{campaign.abstraction}</Typography>
                      <Typography>
                        Time: {campaign.campaign_start_time} ~{" "}
                        {campaign.campaign_end_time}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleCheck();
                        }}
                      >
                        Check it!
                      </Button>
                      <CheckModal
                        open={open}
                        setOpen={setOpen}
                        campaign={campaign}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h1>Loading or No campaign yet</h1>
          )}
        </Container>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          {campaigns ? (
            <Grid container spacing={4}>
              {campaigns.map((campaign, index) => (
                <Grid item key={campaign} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title={campaign.campaign_name}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {campaign.campaign_name}
                      </Typography>
                      <Typography>{campaign.abstraction}</Typography>
                      <Typography>
                        Time: {campaign.campaign_start_time} ~{" "}
                        {campaign.campaign_end_time}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleCheck1();
                        }}
                      >
                        Check it!
                      </Button>
                      <CashModal
                        open={open1}
                        setOpen={setOpen1}
                        campaign={campaign}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h1>Loading or No campaign yet</h1>
          )}
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <ReturnMain />
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
