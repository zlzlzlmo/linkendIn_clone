import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import { useEffect } from "react";
import { auth } from "./firebase";
import { UserState, setUserLoginDetails } from "./redux/modules/user";
import { useAppDispatch } from "./redux/configStore";
function App() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userParam: UserState = {
          name: user?.displayName,
          email: user?.email,
          photoURL: user?.photoURL,
        };
        dispatch(setUserLoginDetails(userParam));
      }
    });
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home">
            <Header />
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
