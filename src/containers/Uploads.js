import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SearchButton from '../components/SearchButton';
import TrackList from '../components/TrackList';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));



export default function Home() {
  const [tracks, setTracks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [myLikesHash, setMyLikesHash] = useState({});
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
        await updateLoadedTracks()
        const myLikesHash = await loadLikesHash();
        setMyLikesHash(myLikesHash)
        setOpen(true)
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  async function updateLoadedTracks() {
    const tracks = await loadTracks();
    setTracks(tracks);
  }

  function loadTracks() {
    return API.get("tracks", "/allTracksOwner");
  }

  function deleteTrack(sk) {
    return API.del("tracks", '/tracks', {
      body: {
        "sk": sk
      }
    });
  }

  async function handleDelete(sk) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTrack(sk)
      await updateLoadedTracks()
    } catch (error) {
      console.log(error)
    }
  }

  function loadLikesHash() {
    return API.get("tracks", "/listAllLikes")
  }

  const showMessage = () => open && tracks.length==0

  return (
    <div className={classes.root}>
      {/* {isAuthenticated ? renderNotes() : renderLander()} */}
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" m={1} p={1} >
            <h1>Your Uploads</h1>
          </Box>
        </Container>
        <Container maxWidth="md">
          <TrackList 
            tracks={tracks} 
            updateLoadedTracks={updateLoadedTracks}
            owner={true}
            myLikesHash={myLikesHash}
            handleDelete={handleDelete}
          />
          {showMessage() && <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          You don't have any uploads!
        </Alert>}

        </Container>
        <Tooltip title="Add" aria-label="add">
          <Fab color="secondary"
            component={Link}
            to="/upload"
            className={classes.absolute}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </React.Fragment>
    </div>
  );
}
