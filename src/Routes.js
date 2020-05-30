import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Uploads from "./containers/Uploads";
import NotFound from "./containers/NotFound";
import NewTrack from "./containers/NewTrack";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <AuthenticatedRoute exact path="/uploads">
        <Uploads />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/upload">
        <NewTrack />
      </AuthenticatedRoute>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
