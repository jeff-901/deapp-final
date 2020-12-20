// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/album
import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Copyright from '../components/copyright';
import ReturnMain from '../components/returnmain'
import { CardHeader } from '@material-ui/core';
import MyAppBar from '../components/myapppbar'


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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const campaigns = [
    {
        campaign_name: 'NTU Basketball Cup',
        abstraction: 'A game EE will definitely win the champion',
        price: 'FREE',
        start_time: "2020/12/18",
        end_time: "2021/1/1",
        sell_time: "2020/12/18"
    },
];

export default function Booking(props) {
  const classes = useStyles();
  const campaigns = [];
  useEffect(()=> {
    campaigns = props.methods.getCampaigns();
  })
  const handleBuy = async () => {
    if (props.user) {
      await props.methods.buyTicket(index, 1).send({ from: accounts[0]});
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <MyAppBar user={props.user} methods={props.methods} accounts={props.accounts} setUser={props.setUser}/>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="m">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Booking tickets of your interested campaigns
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Here are the available campaigns for you!
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {campaigns.map((campaign) => (
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
                    <Typography>
                      {campaign.abstraction}
                    </Typography>
                    <Typography>
                      Available: {campaign.start_time} ~ {campaign.end_time}
                    </Typography>
                  </CardContent>
                  <CardActions >
                    <Button size="small" color="primary" onClick={handleBuy}>
                      Book it!
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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