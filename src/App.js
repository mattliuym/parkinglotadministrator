import './App.css';
import React from 'react';
import 'antd/dist/antd.css';
import MainPage from "./Components/MainPage";
import Login from "./Components/Users/Login";
import Register from "./Components/Users/Register";
import {Redirect, Route, Switch} from 'react-router-dom';

export default class App extends React.Component{
    render() {
        return(
          <div className={"App"}>
              <Switch>
                  <Route path={'/home'} component={MainPage}/>
                  <Route path={'/login'} component={Login}/>
                  <Route path={'/Signup'} component={Register}/>
                  <Redirect to={"/home"}/>
              </Switch>
          </div>
        );
    }
}

