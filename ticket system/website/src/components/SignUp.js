import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// import { createUser } from "../../axios";
import sha256 from "../Mysha256.js";

function getModalStyle() {
  const top = 50;
  const left = 50;

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
  },
}));

function SignUp(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("b07901052@ntu.edu.tw");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [validUsername, setValidUsername] = useState(true);
  const [usernameHelpText, setUsernameHelpText] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [emailHelpText, setEmailHelpText] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [passwordHelpText, setPasswordHelpText] = useState("");
  const [validPassword2, setValidPassword2] = useState(true);
  const [password2HelpText, setPassword2HelpText] = useState("");

  const handleClose = () => {
    setOpen(false);
    props.setSignIn(true);
    props.setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (username.length === 0) {
      setValidUsername(false);
      setUsername("");
      setUsernameHelpText("Username is empty");
    } else if (username.length > 14) {
      setValidUsername(false);
      setUsername("");
      setUsernameHelpText("Username can only contain at most 14 characters!");
    } else if (!email.match(/.+[@].+/) === -1) {
      setEmailHelpText("Invalid Email!\nDon't try to hack me!");
      setValidEmail(false);
      setEmail("");
    } else if (String(password).length < 6) {
      setPasswordHelpText("Password is at least 6 characters!");
      setValidPassword(false);
      setPassword("");
      setPassword2("");
    } else if (String(password) !== String(password2)) {
      setPassword2HelpText("Confirm password is different!");
      setValidPassword2(false);
      setPassword2("");
    } else if (!String(password).match(/[A-Za-z0-9]+/)) {
      setPasswordHelpText("Password can only conatain characters and numbers!");
      setValidPassword(false);
      setPassword("");
      setPassword2("");
    } else {
      let result = await props
        .createUser(username, sha256(password))
        .send({ from: props.accounts[0] });
      result = result.events.OnAddUser.returnValues;
      console.log(result);
      if (result.message === "success") {
        props.setSignIn(true);
      } else {
        // console.log(msg)
        setUsernameHelpText("User create fail!");
        setValidUsername(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setPassword2("");
      }
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={!validUsername}
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onInput={(e) => {
            setUsername(e.target.value);
          }}
          helperText={usernameHelpText}
          onClick={() => {
            setValidUsername(true);
            setUsernameHelpText("");
          }}
          value={username}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={!validEmail}
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          onInput={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          helperText={emailHelpText}
          onClick={() => {
            setValidEmail(true);
            setEmailHelpText("");
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={!validPassword}
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onInput={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          helperText={passwordHelpText}
          onClick={() => {
            setValidPassword(true);
            setPasswordHelpText("");
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={!validPassword2}
          fullWidth
          name="password"
          label="Comfirm password"
          type="password"
          id="password"
          autoComplete="current-password"
          onInput={(e) => {
            setPassword2(e.target.value);
          }}
          value={password2}
          helperText={password2HelpText}
          onClick={() => {
            setValidPassword2(true);
            setPassword2HelpText("");
          }}
        />
        <FormControlLabel
          control={<Checkbox value="accept" color="primary" />}
          label="I accept the rule"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={() => {
                props.setSignIn(true);
              }}
            >
              {"Already have an account? Sign in"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default SignUp;
