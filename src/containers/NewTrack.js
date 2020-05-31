import React, { useRef, useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { Link, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";


import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { InputLabel, Input, FormHelperText } from '@material-ui/core';



import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import TrackList from '../components/TrackList';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({

  alignItemsAndJustifyContent: {
    width: '100%',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  input: {
    display: 'none',
  },
}));

export default function NewTrack() {
  const file = useRef(null);
  const history = useHistory();

  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [fileName, setFileName] = React.useState("");
  
  function createTrack({title, url}) {
    return API.post("tracks", `/tracks`, {
      body: {
        title: title,
        url: url
      }
    });
  }
  function handleFileChange(event) {
    file.current = event.target.files[0];
    setFileName(file.current.name)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a audio file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const url = file.current ? await s3Upload(file.current) : "";
      const result = await createTrack({title: fileName, url});
      history.push("/");
    } catch (e) {
      // onError(e);
      setIsLoading(false);
    }

  }

  return (
    <React.Fragment>
      <CssBaseline />
      <br />
      <Container maxWidth="sm">
        <Paper >
          <div className={classes.alignItemsAndJustifyContent}>
            <form>
              <div>
                <input className={classes.input} 
                  id="icon-button-file"
                  type="file"
                  accept=".mp3,audio/*"
                  onChange={handleFileChange} />
                <label htmlFor="icon-button-file">
                  <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </IconButton>
                  {fileName}
                </label>
              </div>
              <div>
                {fileName && <Button variant="contained" 
                  color="primary" 
                  component="span" 
                  type="submit"
                  onClick={handleSubmit}
                  >
                  {isLoading && <CircularProgress style={{marginLeft: '5px'}} color="secondary" size="1em" />} Upload
                </Button>}
              </div>
            </form>
          </div>
            <br />
        </Paper>
      </Container>
      <Fab color="secondary"
        component={Link}
        to="/upload"
        className={classes.absolute}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}



