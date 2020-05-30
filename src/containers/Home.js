import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
// import "./Home.css";

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
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox'

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
  const [myLikesHash, setMyLikesHash] = useState({});
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const classes = useStyles();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(true);
      try {
        await loadTracksAndLikes()
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  async function loadTracksAndLikes() {
    const tracks = await loadTracks();
    const likesHash = await loadLikesHash();
    console.log('likesHash ' + JSON.stringify(likesHash))
    setTracks(tracks);
    setMyLikesHash(likesHash);
  }

  function loadTracks() {
    return API.get("tracks", "/allTracks")
  }
  function loadLikesHash() {
    return API.get("tracks", "/listAllLikes")
  }

  function generateTasks(checked) {
    console.log('checked ' + checked)
    let filteredTracks = tracks
    if(checked){
      filteredTracks = filteredTracks.filter(track => myLikesHash.hasOwnProperty(track.sk))
    }
      // console.log('i am here ' + checked)
    return ((search == "") ? filteredTracks : filteredTracks.filter(track => track.title.toLowerCase().includes(search)))
  }

  return (
    <div className={classes.root}>
      {/* {isAuthenticated ? renderNotes() : renderLander()} */}
      <React.Fragment>
        <CssBaseline />


        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" m={1} p={1} >
            <SearchButton
              search={search}
              setSearch={setSearch}
            />
          </Box>
        </Container>
        <Container maxWidth="md">
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleChange}
                color="secondary"
              />
            }
            label="Filter by Liked"
          />
          <TrackList
            tracks={generateTasks(checked)}
            myLikesHash={myLikesHash}
            loadTracksAndLikes={loadTracksAndLikes}
          />
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
