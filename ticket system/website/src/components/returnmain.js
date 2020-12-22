import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"
export default function Copyright() {
    return (
        <Button color="contained" component={Link} to="/">
            return to main
        </Button>
    );
  }
