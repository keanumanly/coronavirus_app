import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Manage from './components/manage/manage'
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={props => <Manage {...props} />} />

        <Route exact path="/daily-update" render={props => <Manage {...props} />} />

        <Route exact path="/coronavirus-pandemic" render={props => <Manage {...props} />} />


        <Route path="/" render={props => <Manage {...props} />} /> {/* for redirecting with same page */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
