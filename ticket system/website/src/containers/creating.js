// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "../components/copyright";
import ReturnMain from "../components/returnmain";
import { Redirect } from "react-router-dom";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Creating(props) {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    campaign_name: "NTU Basketball Cup",
    seats: 0,
    price: 0,
    start_time: "2021-01-01",
    end_time: "2021-01-01",
    sell_time: "2021-01-01T12:00",
    abstraction: "",
  });
  // x
  const handleCreate = async () => {
    console.log("create")
    // console.log(props.methods.addCampaign)
    // console.log("user: ", props.user);
    setLoading(true);
    if (
      info.campaign_name &&
      info.seats &&
      info.price &&
      info.start_time &&
      info.end_time &&
      info.sell_time &&
      info.abstraction
    ) {
      // console.log("enter")
      // let startTime = new Date(info.start_time).getTime();
      // let endTime = new Date(info.end_time).getTime();
      // let sellTime = new Date(info.sell_time).getTime();
      let wei = Web3.utils.toWei("0.5", "ether");
      let wei2 = Web3.utils.toWei("0.1", "ether");
      let result = await props.methods
        // .addCampaign(
        //   info.campaign_name,
        //   2,
        //   [10, 20],
        //   [wei, wei2],
        //   /*info.levels, info.seats, info.price, startTime, endTime, sellTime*/ 1,
        //   5000000000,
        //   1,
        //   info.abstraction
        // )
        .addCampaign(
          info.campaign_name,
          2,
          [10, 20],
          [wei, wei2],
          /*info.levels, info.seats, info.price, startTime, endTime, sellTime*/ 
          Date.parse(info.start_time),
          Date.parse(info.end_time),
          Date.parse(info.sell_time),
          info.abstraction
        )
        .send({ from: props.accounts[0] });
      setLoading(false);
      // console.log(result);
      result = result.events.OnAddCampaign.returnValues;
      // console.log(result);
      if (result[0] === "success") {
        alert("success");
        setRedirect(true);
      } else {
        alert("error");
      }
    }
    else {
      setLoading(false)
      alert("Please fill in the complete information!");
      console.log(info.campaign_name);
      console.log(Date.parse(info.start_time));
      let tryd = new Date(Date.parse(info.start_time));
      console.log(tryd)
      console.log(info.end_time);
      console.log(info.sell_time);
    }
  };

  return (
    <>
      {redirect === true ? (
        <Redirect to="/" />
      ) : (
        <Container component="main" maxWidth="xs">
          {/* <CssBaseline /> */}
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Create your campaign
            </Typography>
            {loading === false ? (<form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="campaignName"
                    label="Campaign Name"
                    // value={info["campaign_name"]}
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["campaign_name"]: e.target.value,
                      }));
                    }}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="price"
                    label="Price"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["price"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="seats"
                    label="Seats"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["seats"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="startTime"
                    label="Start Time"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["start_time"]: e.target.value,
                      }));
                    }}
                  /> */}
                   <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="date"
                    label="Start Time"
                    type="date"
                    defaultValue="2021-01-01"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["start_time"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="endTime"
                    label="End Time"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["end_time"]: e.target.value,
                      }));
                    }}
                  /> */}
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="date"
                    label="End Time"
                    type="date"
                    defaultValue="2021-01-01"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["end_time"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="sellTime"
                    label="Sell Time"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["sell_time"]: e.target.value,
                      }));
                    }}
                  /> */}
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="datetime-local"
                    label="Sell Time"
                    type="datetime-local"
                    defaultValue="2021-01-01T00:00"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["sell_time"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Abstraction"
                    id="abstraction"
                    onChange={(e) => {
                      setInfo((info) => ({
                        ...info,
                        ["abstraction"]: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  handleCreate();
                }}
              >
                Create Now!
              </Button>
            </form>
            ): (
              <h1>Creating your campaign...</h1>
            )}
          </div>
          <Box mt={5}>
            <ReturnMain />
            <Copyright />
          </Box>
        </Container>
      )}
    </>
  );
}
