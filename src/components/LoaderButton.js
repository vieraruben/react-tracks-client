import React from "react";
import { Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      variant="contained"
      // className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {props.children}
    </Button>
  );
}
