import React, { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";
import { makeStyles } from '@material-ui/core/styles';
import './TrackList.css';

import { API, Storage } from "aws-amplify";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';

import config from "../config";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%'
  },
}));

export default function TrackList({tracks, loadTracksAndLikes, owner, myLikesHash, handleDelete}) {
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
  }, []);
  
  console.log('myLikesHash ' + JSON.stringify(myLikesHash))
  // console.log('088836d0-a266-11ea-be35-437b2fcd4e5e rubemn'  + myLikesHash.hasOwnProperty("088836d0-a266-11ea-be35-437b2fcd4e5e"))

  const generateColor = (sk) => {
    if(myLikesHash.hasOwnProperty(sk))
      return "secondary"
    return "primary"
  }

  const generateUrl = (filename) => `https://${config.s3.BUCKET}.s3.${config.s3.REGION}.amazonaws.com/public/${filename}`

  async function handleSubmitLike(track) {
    try {
      let value = 1
      if(myLikesHash.hasOwnProperty(track.sk)){
        value *= -1
        await deleteLike(myLikesHash[track.sk])
      }else{
        await createLike(track.sk)
      }
      await markFavorite(track, value)
      await loadTracksAndLikes()
    } catch (e) {
      console.log(e)
    }
  }

  function markFavorite(track, value) {
    return API.put("tracks", `/tracks?pk=${track.pk}`, {
      body: {
        "likes": track.likes*1 + value,
        "sk": track.sk
      }
    });
  }

  function createLike(sk) {
    return API.post("tracks", `/createLike`, {
      body: {
        "sk": sk
      }
    });
  }

  function deleteLike(sk) {
    return API.del("tracks", '/likes', {
      body: {
        "sk": sk
      }
    });
  }

  return (
    <TableContainer component={Paper} className="TrackList">
      <Table className={classes.table} aria-label="simple table">
        <TableBody>
          {tracks.map((row, key) => (
            
            <TableRow key={key}>
              
              <TableCell align="right">
                <Button
                  onClick={() => handleSubmitLike(row, key)}
                  color={generateColor(row.sk)}><h1>{row.likes}</h1>
                  <ThumbUpIcon />
                  
                </Button>
              </TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell>
                <audio controls>
                  <source src={generateUrl(row.url)} type="audio/mpeg" />
                </audio>
              </TableCell>
              {owner && <TableCell>
                <Button onClick={() => handleDelete(row.sk)}><DeleteRoundedIcon /> </Button>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
