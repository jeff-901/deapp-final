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
import Web3 from "web3";

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

function convert(date) {
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  let day = date.getDate().toString();
  if (day.length === 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}

export default function Checking(props) {
  const classes = useStyles();
  const [openall, setOpenall] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tickets, setTickets] = useState([]);
  let my_campaigns;
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
    // console.log("tickets: ");
    // console.log("campaign_address: ", campaigns_address);
    // console.log("levels: ", levels);
    // console.log("seats: ", seats);
    // console.log(result);
    let t = [];
    if (result === undefined || result === {}) {
      setTickets([]);
    } else {
      for (let i = 0; i < result[0].length; i++) {
        t.push(
          await props.methods
            .viewCampaign(result[0][i])
            .call({ from: props.accounts[0] })
        );
        let image_link = await props.methods
                      .viewCampaign2(result[0][i])
                      .call({ from: props.accounts[0] })
        let tmp = new Date(parseInt(t[i]["campaign_start_time"]));
        t[i]["campaign_start_time"] = convert(tmp);
        tmp = new Date(parseInt(t[i]["campaign_end_time"]));
        t[i]["campaign_end_time"] = convert(tmp);
        t[i]["address"] = result[0][i];
        t[i]["level"] = result[1][i];
        t[i]["seat_num"] = result[2][i];
        t[i]["image"] = image_link;
        t[i]["price"] = Web3.utils.fromWei(t[i]["price"][t[i]["level"]].toString(), "ether")
      }
    }
    setTickets(t);
    console.log(tickets)

    my_campaigns = await props.methods
      .getUserCampaigns()
      .call({ from: props.accounts[0] });
    console.log("campaign: ", my_campaigns);
    let c = [];
    if (my_campaigns === undefined || my_campaigns === []) {
      setCampaigns([]);
    } else {
      for (let i = 0; i < my_campaigns.length; i++) {
        c.push(
          await props.methods
            .viewCampaign(my_campaigns[i])
            .call({ from: props.accounts[0] })
        );
        let image_link = await props.methods
                      .viewCampaign2(my_campaigns[i])
                      .call({ from: props.accounts[0] })
        let tmp = new Date(parseInt(c[i]["campaign_start_time"]));
        c[i]["campaign_start_time"] = convert(tmp);
        tmp = new Date(parseInt(c[i]["campaign_end_time"]));
        c[i]["campaign_end_time"] = convert(tmp);
        c[i]["address"] = my_campaigns[i];
        c[i]["image"] = image_link;
        let p = []
        for(let j = 0; j < c[i]["price"].length;j++){
          p.push(Web3.utils.fromWei(c[i]["price"][j].toString(), "ether"));
        }
        c[i]["price"] = p;
      }
    }
    // for (let i = 0; i < c.length; i++){
    //   c[i][]
    // }
    setCampaigns(c);
    // console.log(campaigns)
    // setOpenall(toOpen);
    // console.log(openall)
    console.log("campaign",campaigns[0]);
    let toOpen = Array(campaigns.length).fill(false);
    console.log(toOpen);
    setOpenall(toOpen);
    console.log(openall);
  }, [open]);
  // campaigns = [
  //   {
  //     campaign_name: "test",
  //     abstraction: "testing",
  //     campaign_start_time: "2021-01-18",
  //     campaign_end_time: "2021-01-18",
  //     price: ["10"],
  //   },
  //   {
  //     campaign_name: "test2",
  //     abstraction: "testing2",
  //     campaign_start_time: "2021-01-20",
  //     campaign_end_time: "2021-01-20",
  //     price: ["10"],
  //   },
  // ];

  const handleCheck = (index) => {
    let toOpen = Array(campaigns.length).fill(false);
    toOpen[index] = true;
    setOpenall(toOpen);
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
  const handleCheck1 = (index) => {
    let toOpen = Array(campaigns.length).fill(false);
    toOpen[index] = true;
    setOpen1(toOpen);
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
  console.log("tickets:", tickets)

  return (
    <React.Fragment>
      <CssBaseline />
      {/* <MyAppBar /> */}
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
          <Typography
            component="h3"
            variant="h4"
            align="Left"
            color="textPrimary"
            gutterBottom
          >
            Your tickets
          </Typography>
          {/* End hero unit */}
          {tickets.length != 0 ? (
            <Grid container spacing={4}>
              {tickets.map((ticket, index) => (
                <Grid item key={ticket} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={ticket.image}
                      title={ticket.campaign_name}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {ticket.campaign_name}
                      </Typography>
                      <Typography>{ticket.abstraction}</Typography>
                      <Typography>
                        Time: {ticket.campaign_start_time} ~{" "}
                        {ticket.campaign_end_time}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleCheck1(index);
                        }}
                      >
                        Check it!
                      </Button>
                      <CheckModal
                        open={open1[index]}
                        setOpen={setOpen1}
                        campaign={ticket}
                        methods={props.methods}
                        accounts={props.accounts}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h1>You have no ticket yet</h1>
          )}
        </Container>
        <Container className={classes.cardGrid} maxWidth="md">
          <Typography
            component="h3"
            variant="h4"
            align="Left"
            color="textPrimary"
            gutterBottom
          >
            Your campaigns
          </Typography>
          {/* End hero unit */}
          {campaigns.length != 0 ? (
            <Grid container spacing={4}>
              {campaigns.map((campaign, index) => (
                <Grid item key={campaign} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={campaign.image}
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
                          handleCheck(index);
                        }}
                      >
                        Check it!
                      </Button>
                      <CashModal
                        open={openall[index]}
                        setOpen={setOpenall}
                        campaign={campaign}
                        methods={props.methods}
                        accounts={props.accounts}
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h1>You have no campaign yet</h1>
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
