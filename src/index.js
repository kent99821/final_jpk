import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Login from './components/guanliyuan/login';
import Home from './home'
import Admin from './components/guanliyuan/admin'
import MyRouter from './components/guanliyuan/myRouter'
ReactDOM.render(
(
<HashRouter>
  <Switch>
  <Route path='/login' component={Login}></Route>
  <Route path='/home' component={Home}></Route>
  <MyRouter path='/admin' component={Admin}></MyRouter>
  <Redirect path="/" to="/home/main" />
</Switch>
</HashRouter>
)  
,
  document.getElementById('root')
);


