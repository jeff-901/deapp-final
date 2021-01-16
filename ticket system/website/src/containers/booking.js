// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/album
import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Copyright from "../components/copyright";
import ReturnMain from "../components/returnmain";
import { CardHeader } from "@material-ui/core";
import MyAppBar from "../components/myapppbar";
import BookModal from "../components/BookModal";

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
  let month = (date.getMonth()+1).toString();
  if(month.length === 1){
    month = "0" + month
  }
  let day = date.getDate().toString();
  if(day.length === 1){
    day = "0"+day
  }
  return year + "-" + month + "-" + day
}

// const campaigns = [
//     {
//         campaign_name: 'NTU Basketball Cup',
//         abstraction: 'A game EE will definitely win the champion',
//         price: 'FREE',
//         start_time: "2020/12/18",
//         end_time: "2021/1/1",
//         sell_time: "2020/12/18"
//     },
// ];

export default function Booking(props) {
  const classes = useStyles();
  const [campaigns, setCampaigns] = useState([]);
  const [open, setOpen] = useState([]);
  const [open1, setOpen1] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    console.log("fetch data");
    let result = await props.methods
      .getCampaigns()
      .call({ from: props.accounts[0] });
    console.log(result);

    let c = [];
    if (result === undefined || result === []) {
      setCampaigns([]);
    } else {
      // console.log(result[0]);
      for (let i = 0; i < result.length; i++) {
        // let cc =
        c.push(
          await props.methods
            .viewCampaign(result[i])
            .call({ from: props.accounts[0] })
        );
        let image_link = await props.methods
                      .viewCampaign2(result[i])
                      .call({ from: props.accounts[0] })
        let tmp  = new Date(parseInt(c[i]["campaign_start_time"]))
        c[i]["campaign_start_time"] = convert(tmp);
        tmp  = new Date(parseInt(c[i]["campaign_end_time"]))
        c[i]["campaign_end_time"] = convert(tmp);
        tmp  = new Date(parseInt(c[i]["start_sell_time"]))
        c[i]["start_sell_time"] = tmp;
        c[i]["address"] = result[i];
        c[i]["image"] = image_link;
      }
      console.log(c);
    }
    let now = new Date();
    c = c.filter(cam => Number(cam["start_sell_time"]) < Number(now));
    setCampaigns(c);
    let toOpen = Array(campaigns.length).fill(false);
    console.log(toOpen);
    setOpen(toOpen);
    console.log(open);
  }, [open1]);
  // init();

  const handleBookIt = (index) => {
    let toOpen = Array(campaigns.length).fill(false);
    toOpen[index] = true;
    setOpen(toOpen);
  };
  console.log(campaigns);
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <MyAppBar
        user={props.user}
        methods={props.methods}
        accounts={props.accounts}
        setUser={props.setUser}
      /> */}
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
              Booking tickets of your interested campaigns
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Here are the available campaigns for you!
            </Typography>
          </Container>
        </div>
        { loading == false ? (
        <Container className={classes.cardGrid} maxWidth="md">
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
                        Time:
                        {campaign.campaign_start_time} ~{" "}
                        {campaign.campaign_end_time}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          handleBookIt(index);
                        }}
                      >
                        Book it!
                      </Button>
                      <BookModal
                        open={open[index]}
                        setOpen={setOpen}
                        setLoading={setLoading}
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
            <h1>There is no campaign yet</h1>
          )}
        </Container>
        ) : (
          <h1>Booking the champaign...</h1>
        )
      }
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
