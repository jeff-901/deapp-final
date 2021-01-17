// refer to: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
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
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
function getModalStyle() {
  const top = 30;
  const left = 43;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    title: {
        textAlign: "center",
    },
  });

  const MyTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography component="h1" variant="h5" className={classes.title}>{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

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
  const handleRefund = async () => {
    let result = await props.methods
      .refund(
        props.campaign.address,
        props.campaign.level,
        props.campaign.seat_num
      )
      .send({
        from: props.accounts[0],
      });
      // result = result.events.onRefundTicket.returnValues;
      // alert(result.message);
      // props.setOpen(false);
  };
  // console.log(props.campaign);

  let start_time = new Date(props.campaign.campaign_start_time);
  let end_time = new Date(props.campaign.campaign_end_time);
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MyTitle id="customized-dialog-title" onClose={handleClose}>{props.campaign.campaign_name}</MyTitle>
              {/* <Typography component="h1" variant="h5" className={classes.title}>
                {props.campaign.campaign_name}
              </Typography> */}
            </Grid>
            <Grid item xs={12}>
              <Typography component="h4" variant="h5" className={classes.time}>
                Campaign Time: <br />
                
                  {"  "}
                  {start_time.toDateString()} ~ {end_time.toDateString()}
                
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h4" variant="h5" className={classes.time}>
                Abstraction: <br />
                {"  "}
                {props.campaign.abstraction}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography component="p" variant="h5" className={classes.time}>
                Seat Number: {props.campaign.seat_num}
              </Typography>
              <Typography component="p" variant="h5" className={classes.time}>
                Price: {props.campaign.price}
              </Typography>
            </Grid>
           
            <Grid item xs={12} sm={6}>
              <Button
                // type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => {
                  handleRefund();
                }}
              >
                Confirm refund
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}
