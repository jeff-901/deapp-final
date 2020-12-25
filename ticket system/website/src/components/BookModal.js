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
function getModalStyle() {
  const top = 25;
  const left = 40;

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
    margin: theme.spacing(3, 0, 2),
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
  // console.log(props.open);
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper} style={modalStyle}>
        <Typography component="h1" variant="h5">
          {props.campaign.campaign_name}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel id="demo-simple-select-label">Price</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={level}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                {props.campaign.price.map((ele, i) => {
                  return <MenuItem value={i}>{ele}</MenuItem>;
                })}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
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
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                // type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  handleBuy();
                }}
              >
                Confirm buy!
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}
