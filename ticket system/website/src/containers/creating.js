// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
import React, { useState } from "react";
// import { ImageStore, Text, View, StyleSheet } from "react-native";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "../components/copyright";
import ReturnMain from "../components/returnmain";
// import MenuItem from "@material-ui/core/MenuItem";
import { Redirect } from "react-router-dom";
import Web3 from "web3";
import { Input, MenuItem } from "@material-ui/core";

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
  let imgLoading = false;
  let imageLink;
  const [info, setInfo] = useState({
    image: null,
    campaign_name: "NTU Basketball Cup",
    level: 1,
    seats: 0,
    price: 0,
    start_time: "2021-01-01",
    end_time: "2021-01-01",
    sell_time: "2021-01-01T12:00",
    abstraction: "",
  });
  // x
  const level_options = [1, 2, 3];
  const getUrl = async () => {
    let clientId = "81d9d1f530b130d";
    let Imgtoken = "1c0ba48708dba7f3a0e7f04eb2ab22aaa1c348c9";
    let auth;
    if (Imgtoken) {
      auth = "Bearer " + Imgtoken;
    } else {
      auth = "Client-ID " + clientId;
    }
    // console.log("auth: ", auth);
    const formData = new FormData();
    const splitData = info.image.split(",");
    // console.log(splitData[1]);
    formData.append("image", splitData[1]);
    formData.append("type", "base64");

    const r = new XMLHttpRequest();
    r.open("POST", "https://api.imgur.com/3/image/", false);
    r.setRequestHeader("Authorization", auth);
    r.onreadystatechange = async () => {
      if (r.status === 200 && r.readyState === 4) {
        console.log("success");
        let res = JSON.parse(r.responseText);
        imageLink = res.data.link;
      } else {
        let res = JSON.parse(r.responseText);
        console.log(res);
      }
    };
    r.send(formData);
  };
  const handleCreate = async () => {
    console.log("create");
    await getUrl();
    console.log("imageLink: ", imageLink);
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
      info.abstraction &&
      !imgLoading
    ) {
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
          imageLink,
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
      result = result.events.OnAddCampaign.returnValues;
      if (result[0] === "success") {
        alert("success");
        setRedirect(true);
      } else {
        alert("error");
      }
    } else {
      setLoading(false);
      alert("Please fill in the complete information!");
      console.log(info.campaign_name);
      console.log(Date.parse(info.start_time));
      let tryd = new Date(Date.parse(info.start_time));
      console.log(tryd);
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
            {loading === false ? (
              <form className={classes.form} noValidate>
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      select
                      id="level"
                      label="Level"
                      value={info.level}
                      onChange={(e) => {
                        setInfo((info) => ({
                          ...info,
                          ["level"]: e.target.value,
                        }));
                      }}
                    >
                      {level_options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                      id="image"
                      label=""
                      type="file"
                      onChange={(e) => {
                        let reader = new FileReader();
                        imgLoading = true;
                        reader.onload = (e) => {
                          imgLoading = false;
                          setInfo((info) => ({
                            ...info,
                            ["image"]: e.target.result,
                          }));
                        };
                        reader.readAsDataURL(e.target.files[0]);
                        // setInfo((info) => ({
                        //   ...info,
                        //   ["image"]: e.target.files[0],
                        // }));
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
            ) : (
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
