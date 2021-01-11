// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "./copyright";
import ReturnMain from "./returnmain";
import { Redirect } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Web3 from "web3";

function getModalStyle() {
  const top = 30;
  const left = 43;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(1, 1, 2, 8),
  },
  cancel: {
    margin: theme.spacing(1, 0, 2, 1),
  },
  select: {
    minWidth: 120,
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  time: {
    // textAlign: "center",
    fontSize: 15,
  },
  abstraction: {
    // textAlign: "center",
    fontSize: 15,
  },
  total: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonGrid: {
    alignItems: "flex-end",
    alignContent: "flex-end",
    justify: "center",
  },
  gridContainer: {
    alignItems: "flex-end",
    alignContent: "flex-end",
    justify: "center",
  },
}));

export default function BookModal(props) {
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [amount, setAmount] = useState("");
  const [level, setLevel] = useState("");
  const options = [1, 2, 3, 4];
  const handleClose = () => {
    props.setOpen(false);
  };
  const handleLevelChange = (index) => {
    // console.log(index);
    setLevel(Number(index));
  };
  const handleAmountChange = (index) => {
    setAmount(Number(index));
  };
  const handleBuy = async () => {
    // console.log(props.campaign.address);
    // console.log(props.campaign.price.findIndex((ele) => ele == level));
    // console.log(amount);
    let result = await props.methods
      .buyTicket(
        props.campaign.address,
        amount,
        props.campaign.price.findIndex((ele) => ele == level)
      )
      .send({
        from: props.accounts[0],
        value: amount * level,
      });
    result = result.events.OnBuyTicket.returnValues;
    alert(result.message);
    props.setOpen(false);
  };
  // console.log(props.campaign);

  let start_time = new Date(Number(props.campaign.campaign_start_time * 1000)); //change second to millisecond
  let end_time = new Date(Number(props.campaign.campaign_end_time * 1000));
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper} style={modalStyle}>
        {/* <Typography component="h1" variant="h5">
          {props.campaign.campaign_name}
        </Typography> */}
        <form className={classes.form} noValidate>
          <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5" className={classes.title}>
                {props.campaign.campaign_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" variant="h5" className={classes.time}>
                Campaign Time: <br />
                {/* <p style={{ textIndent: "20" }}> */}
                {start_time.toDateString()} ~ {end_time.toDateString()}
                {/* </p> */}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                component="p"
                variant="h5"
                className={classes.abstraction}
              >
                Abstraction: <br />
                {"  "}
                {props.campaign.abstraction}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.select}>
                <InputLabel id="demo-simple-select-label">Price</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  // style={{ minWidth: "120" }}
                >
                  {props.campaign.price.map((ele, i) => {
                    let ele_ether = Web3.utils.fromWei(String(ele), "ether");
                    return <MenuItem value={ele}>{ele_ether}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl className={classes.select}>
                <InputLabel id="demo-simple-select-label">Amount</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                >
                  {options.map((ele) => {
                    return <MenuItem value={ele}>{ele}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" variant="h5" className={classes.total}>
                Total cost:{" "}
                {Web3.utils.fromWei(String(amount * level), "ether")}
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.buttonGrid}>
              <Button
                // type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  handleBuy();
                }}
              >
                Confirm buy
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.cancel}
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}
