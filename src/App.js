import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="">
        <div className={classes.root}>
          <AppBar position="static" style={{ margin: 0 }}>
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to="/">
                <TrackChangesIcon /> ReactTracks
              </IconButton>
              {isAuthenticated ? (
                <>
                  <Typography variant="h6"
                    className={classes.title}
                  >

                  </Typography>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/uploads"
                  >Uploads</Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                  >Logout</Button>
                </>
              ) : (
                  <>
                    <Typography variant="h6"
                      className={classes.title}
                    >
                    </Typography>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/signup"
                    >Signup</Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                    >Login</Button>
                  </>
                )}
            </Toolbar>
          </AppBar>
        </div>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
