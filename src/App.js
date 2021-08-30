import './App.css';
import React from 'react';
import 'antd/dist/antd.css';
import MainPage from "./Components/MainPage";
import Login from "./Components/Users/Login"
import {Route, Switch} from 'react-router-dom'

export default class App extends React.Component{
    render() {
        return(
          <div className={"App"}>
              <Switch>
                  <Route path={'/'} component={MainPage} exact/>
                  <Route path={'/login'} component={Login}/>
              </Switch>
          </div>
        );
    }
}

